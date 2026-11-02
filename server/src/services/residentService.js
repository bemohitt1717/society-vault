import User from '../models/User.js';
import MaintenanceDue from '../models/MaintenanceDue.js';
import Payment from '../models/Payment.js';
import parsePagination from '../utils/parsePagination.js';
import ApiError from '../utils/ApiError.js';

const publicResidentFields = 'email role status profileComplete profile lastLoginAt createdAt';

export const listResidents = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { role: 'resident' };
  if (query.status === 'Active' || query.status === 'Inactive') {
    filter['profile.membershipStatus'] = query.status;
  } else if (query.status) {
    filter.status = query.status;
  }
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { email: { $regex: escaped, $options: 'i' } },
      { 'profile.name': { $regex: escaped, $options: 'i' } },
      { 'profile.flatNo': { $regex: escaped, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter).select(publicResidentFields).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  const residentIds = items.map((resident) => resident._id);
  const [dues, payments] = await Promise.all([
    MaintenanceDue.aggregate([
      { $match: { resident: { $in: residentIds }, status: { $in: ['pending', 'partially_paid'] } } },
      { $group: { _id: '$resident', outstanding: { $sum: { $subtract: [{ $add: ['$amount', '$penalty'] }, '$paidAmount'] } } } },
    ]),
    Payment.aggregate([
      { $match: { resident: { $in: residentIds }, status: 'completed' } },
      { $group: { _id: '$resident', totalPaid: { $sum: '$amount' } } },
    ]),
  ]);
  const outstandingByResident = new Map(dues.map((item) => [item._id.toString(), item.outstanding]));
  const paidByResident = new Map(payments.map((item) => [item._id.toString(), item.totalPaid]));

  return {
    items: items.map((resident) => ({
      ...resident,
      id: resident._id,
      name: resident.profile?.name || '',
      flat: [resident.profile?.wing, resident.profile?.flatNo].filter(Boolean).join('-'),
      type: resident.profile?.type || 'Owner',
      contact: resident.profile?.phone || '',
      maintenanceAmount: resident.profile?.maintenanceAmount || 0,
      outstanding: outstandingByResident.get(resident._id.toString()) || 0,
      totalPaid: paidByResident.get(resident._id.toString()) || 0,
    })),
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const createResident = async ({ email, profile }) => {
  const user = await User.create({
    email: email.trim().toLowerCase(),
    role: 'resident',
    status: profile.membershipStatus === 'Inactive' ? 'disabled' : 'invited',
    profile,
    profileComplete: true,
  });
  return User.findById(user.id).select(publicResidentFields);
};

export const updateResident = async (id, { email, profile }) => {
  const user = await User.findOne({ _id: id, role: 'resident' }).select('+passwordHash +firebaseUid');
  if (!user) throw new ApiError(404, 'Resident not found.');
  if (email) user.email = email.trim().toLowerCase();
  user.profile = profile;
  if (profile.membershipStatus === 'Inactive') user.status = 'disabled';
  else if (user.status === 'disabled') user.status = user.passwordHash || user.firebaseUid ? 'active' : 'invited';
  await user.save();
  return User.findById(user.id).select(publicResidentFields);
};

export const disableResident = async (id) => {
  const user = await User.findOneAndUpdate(
    { _id: id, role: 'resident' },
    { $set: { status: 'disabled', 'profile.membershipStatus': 'Inactive' } },
    { new: true },
  ).select(publicResidentFields);
  if (!user) throw new ApiError(404, 'Resident not found.');
  return user;
};

export const getResidentDues = async (residentId, query = {}) => {
  const filter = { resident: residentId };
  if (query.status) filter.status = query.status;
  const { page, limit, skip } = parsePagination(query);
  const [items, total] = await Promise.all([
    MaintenanceDue.find(filter).sort({ dueDate: -1 }).skip(skip).limit(limit).lean(),
    MaintenanceDue.countDocuments(filter),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const listAllDues = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = query.status ? { status: query.status } : {};
  const [items, total, outstanding] = await Promise.all([
    MaintenanceDue.find(filter)
      .populate('resident', 'email profile.name profile.flatNo profile.wing')
      .sort({ dueDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    MaintenanceDue.countDocuments(filter),
    MaintenanceDue.aggregate([
      { $match: { status: { $in: ['pending', 'partially_paid'] } } },
      {
        $group: {
          _id: null,
          amount: { $sum: { $subtract: [{ $add: ['$amount', '$penalty'] }, '$paidAmount'] } },
          bills: { $sum: 1 },
          overdue: {
            $sum: {
              $cond: [
                { $lt: ['$dueDate', new Date()] },
                { $subtract: [{ $add: ['$amount', '$penalty'] }, '$paidAmount'] },
                0,
              ],
            },
          },
        },
      },
    ]),
  ]);
  return {
    items: items.map((due) => ({
      ...due,
      id: due._id,
      residentName: due.resident?.profile?.name || due.resident?.email || '',
      flat: [due.resident?.profile?.wing, due.resident?.profile?.flatNo].filter(Boolean).join('-'),
      outstanding: due.amount + due.penalty - due.paidAmount,
    })),
    stats: {
      totalOutstanding: outstanding[0]?.amount || 0,
      overdueAmount: outstanding[0]?.overdue || 0,
      unpaidBills: outstanding[0]?.bills || 0,
    },
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const createDue = async (data) => {
  const resident = await User.findOne({ _id: data.resident, role: 'resident', status: 'active' }).select('_id');
  if (!resident) throw new ApiError(404, 'Active resident not found.');
  return MaintenanceDue.create(data);
};
