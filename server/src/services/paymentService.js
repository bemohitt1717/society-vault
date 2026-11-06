import Payment from '../models/Payment.js';
import MaintenanceDue from '../models/MaintenanceDue.js';
import Income from '../models/Income.js';
import User from '../models/User.js';
import parsePagination from '../utils/parsePagination.js';
import ApiError from '../utils/ApiError.js';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';

const createReceiptNumber = () => `REC-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID().slice(0, 8).toUpperCase()}`;

const recordPaymentIncome = async (payment, actorId, session) => {
  const resident = await User.findById(payment.resident).select('email profile').session(session);
  if (!resident) throw new ApiError(404, 'Resident account for this payment no longer exists.');
  const due = payment.dues.length === 1
    ? await MaintenanceDue.findById(payment.dues[0]).select('category').session(session)
    : null;
  await Income.create([{
    description: `Resident payment - ${payment.month || 'Maintenance'}`,
    category: due?.category || payment.category || 'Maintenance Charges',
    amount: payment.amount,
    date: payment.date,
    paymentMode: payment.paymentMode,
    transactionRef: payment.transactionId,
    resident: resident._id,
    residentName: resident.profile?.name || '',
    flat: [resident.profile?.wing, resident.profile?.flatNo].filter(Boolean).join('-'),
    sourcePaymentId: payment._id,
    createdBy: actorId,
  }], { session });
};

export const listResidentPayments = async (residentId, query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { resident: residentId };
  if (query.status) filter.status = query.status;
  if (query.dateFrom || query.dateTo) {
    filter.date = {};
    if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.date.$lte = new Date(`${query.dateTo}T23:59:59.999Z`);
  }
  const [items, total, totals] = await Promise.all([
    Payment.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
    Payment.countDocuments(filter),
    Payment.aggregate([
      { $match: { ...filter, resident: new mongoose.Types.ObjectId(residentId), status: 'completed' } },
      { $group: { _id: null, totalPaid: { $sum: '$amount' }, completedCount: { $sum: 1 } } },
    ]),
  ]);
  return {
    items,
    stats: totals[0] || { totalPaid: 0, completedCount: 0 },
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const listAdminPayments = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.resident) filter.resident = query.resident;
  if (query.dateFrom || query.dateTo) {
    filter.date = {};
    if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.date.$lte = new Date(`${query.dateTo}T23:59:59.999Z`);
  }
  const [items, total] = await Promise.all([
    Payment.find(filter).populate('resident', 'email profile').sort({ date: -1 }).skip(skip).limit(limit).lean(),
    Payment.countDocuments(filter),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const getPaymentById = async (id) => {
  const payment = await Payment.findById(id).populate('resident', 'email profile').populate('dues').lean();
  if (!payment) throw new ApiError(404, 'Payment not found.');
  return payment;
};

export const createManualPayment = async (data, actorId) => {
  const mongoose = await import('mongoose');
  const session = await mongoose.default.startSession();
  let createdPayment;
  try {
    await session.withTransaction(async () => {
      const dues = await MaintenanceDue.find({
        _id: { $in: data.dueIds },
        resident: data.resident,
        status: { $in: ['pending', 'partially_paid'] },
      }).session(session);
      if (dues.length !== data.dueIds.length) {
        throw new ApiError(400, 'One or more selected dues are unavailable or already settled.');
      }

      const outstandingAmount = dues.reduce(
        (sum, due) => sum + due.amount + due.penalty - due.paidAmount,
        0,
      );
      if (Math.abs(outstandingAmount - data.amount) > 0.01) {
        throw new ApiError(400, 'Payment amount must match the selected outstanding dues.');
      }

      [createdPayment] = await Payment.create([{
        resident: data.resident,
        dues: dues.map((due) => due._id),
        amount: data.amount,
        paymentMode: data.paymentMode,
        transactionId: data.transactionId,
        date: data.date || new Date(),
        month: dues.length === 1 ? dues[0].month : 'Multiple',
        category: dues.length === 1 ? dues[0].category : 'Multiple dues',
        status: data.status || 'completed',
        receiptNo: data.status === 'pending' ? undefined : createReceiptNumber(),
        recordedBy: actorId,
      }], { session });

      if (createdPayment.status === 'completed') {
        await MaintenanceDue.updateMany(
          { _id: { $in: dues.map((due) => due._id) }, resident: data.resident },
          [{ $set: { status: 'paid', paidAmount: { $add: ['$amount', '$penalty'] } } }],
          { session },
        );
        await recordPaymentIncome(createdPayment, actorId, session);
      }
    });
  } finally {
    await session.endSession();
  }
  return createdPayment;
};

export const initiateResidentPayment = async (residentId, { dueIds = [], payAll = false, paymentMode }) => {
  if (!payAll && !dueIds.length) throw new ApiError(400, 'Select at least one due to pay.');
  const requestedDues = payAll
    ? await MaintenanceDue.find({
      resident: residentId,
      status: { $in: ['pending', 'partially_paid'] },
    }).select('_id')
    : dueIds;
  const requestedDueIds = requestedDues.map((due) => due._id || due);
  if (!requestedDueIds.length) throw new ApiError(400, 'There are no outstanding dues to pay.');
  const dues = await MaintenanceDue.find({
    _id: { $in: requestedDueIds },
    resident: residentId,
    status: { $in: ['pending', 'partially_paid'] },
  });
  if (dues.length !== requestedDueIds.length) {
    throw new ApiError(400, 'One or more selected dues are unavailable or already paid.');
  }

  const pendingPayment = await Payment.exists({
    dues: { $in: requestedDueIds },
    status: 'pending',
  });
  if (pendingPayment) throw new ApiError(409, 'A payment request is already in progress for one of these dues.');

  const amount = dues.reduce((sum, due) => sum + due.amount + due.penalty - due.paidAmount, 0);
  return Payment.create({
    resident: residentId,
    dues: dues.map((due) => due._id),
    amount,
    month: dues.length === 1 ? dues[0].month : 'Multiple',
    category: dues.length === 1 ? dues[0].category : 'Multiple dues',
    paymentMode,
    status: 'pending',
  });
};

export const getResidentPaymentReport = async (residentId, query = {}) => {
  const filter = { resident: residentId };
  if (query.status) filter.status = query.status;
  if (query.dateFrom || query.dateTo) {
    filter.date = {};
    if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.date.$lte = new Date(`${query.dateTo}T23:59:59.999Z`);
  }
  const [payments, totals] = await Promise.all([
    Payment.find(filter).sort({ date: -1 }).limit(500).lean(),
    Payment.aggregate([
      { $match: { ...filter, resident: new mongoose.Types.ObjectId(residentId), status: 'completed' } },
      { $group: { _id: null, totalPaid: { $sum: '$amount' }, completedCount: { $sum: 1 } } },
    ]),
  ]);
  return {
    payments,
    summary: totals[0] || { totalPaid: 0, completedCount: 0 },
  };
};

export const updatePaymentStatus = async (id, status, actorId) => {
  const mongoose = await import('mongoose');
  const session = await mongoose.default.startSession();
  let updatedPayment;
  try {
    await session.withTransaction(async () => {
      const payment = await Payment.findOne({ _id: id, status: 'pending' }).session(session);
      if (!payment) {
        const exists = await Payment.exists({ _id: id });
        if (!exists) throw new ApiError(404, 'Payment not found.');
        throw new ApiError(409, 'Only pending payments can be updated.');
      }

      payment.status = status;
      payment.recordedBy = actorId;
      if (status === 'completed') payment.receiptNo = createReceiptNumber();
      await payment.save({ session });

      if (status === 'completed') {
        const result = await MaintenanceDue.updateMany(
          {
            _id: { $in: payment.dues },
            resident: payment.resident,
            status: { $in: ['pending', 'partially_paid'] },
          },
          [{ $set: { status: 'paid', paidAmount: { $add: ['$amount', '$penalty'] } } }],
          { session },
        );
        if (result.modifiedCount !== payment.dues.length) {
          throw new ApiError(409, 'One or more payment dues were changed by another request.');
        }
        await recordPaymentIncome(payment, actorId, session);
      }
      updatedPayment = payment;
    });
  } finally {
    await session.endSession();
  }
  return updatedPayment;
};
