import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import Category from '../models/Category.js';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import MaintenanceDue from '../models/MaintenanceDue.js';
import MaintenanceSchedule from '../models/MaintenanceSchedule.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const residents = [
  { name: 'Aarav Sharma', email: 'resident01@societyvault.test', phone: '9000000001', wing: 'A', flatNo: '101', type: 'Owner', maintenanceAmount: 3500 },
  { name: 'Ananya Verma', email: 'resident02@societyvault.test', phone: '9000000002', wing: 'A', flatNo: '102', type: 'Owner', maintenanceAmount: 3500 },
  { name: 'Rohan Patel', email: 'resident03@societyvault.test', phone: '9000000003', wing: 'B', flatNo: '201', type: 'Tenant', maintenanceAmount: 4200 },
  { name: 'Meera Iyer', email: 'resident04@societyvault.test', phone: '9000000004', wing: 'B', flatNo: '202', type: 'Owner', maintenanceAmount: 4200 },
  { name: 'Kabir Singh', email: 'resident05@societyvault.test', phone: '9000000005', wing: 'C', flatNo: '301', type: 'Tenant', maintenanceAmount: 5000 },
];

const samplePassword = 'SocietyVault@123';
const incomeCategories = ['Maintenance Charges', 'Other Income'];
const expenseCategories = ['Security Services', 'Housekeeping', 'Common Area Electricity'];

const monthLabel = (date) => date.toLocaleString('en-IN', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const dateInMonth = (month, day) => new Date(Date.UTC(
  month.getUTCFullYear(),
  month.getUTCMonth(),
  day,
  12,
));

const ensureCategory = async (name, type) => {
  await Category.updateOne(
    { name, type },
    { $setOnInsert: { name, type, active: true } },
    { upsert: true },
  );
};

const getOrCreateResident = async (profile, passwordHash) => {
  const existing = await User.findOne({ email: profile.email });
  if (existing) {
    const matchesFixture = existing.role === 'resident'
      && existing.name === profile.name
      && existing.profile?.wing === profile.wing
      && existing.profile?.flatNo === profile.flatNo;
    if (!matchesFixture) {
      throw new Error(`The reserved sample account ${profile.email} already belongs to another record. No existing account was changed.`);
    }
    return existing;
  }

  return User.create({
    name: profile.name,
    email: profile.email,
    passwordHash,
    role: 'resident',
    status: 'active',
    profileComplete: true,
    profile: {
      name: profile.name,
      phone: profile.phone,
      wing: profile.wing,
      flatNo: profile.flatNo,
      type: profile.type,
      maintenanceAmount: profile.maintenanceAmount,
      membershipStatus: 'Active',
    },
  });
};

const seedSampleData = async () => {
  if (env.NODE_ENV === 'production') {
    throw new Error('Sample data is disabled when NODE_ENV=production.');
  }
  if (!process.argv.includes('--confirm')) {
    throw new Error('To add local sample data, run: npm run seed:sample-data -- --confirm');
  }

  await connectDatabase();

  const admin = await User.findOne({ role: 'admin', status: 'active' }).select('_id');
  if (!admin) {
    throw new Error('Create an administrator first with npm run seed:admin, then run this command again.');
  }

  console.info(`Adding local sample data to database "${mongoose.connection.name}".`);
  const passwordHash = await bcrypt.hash(samplePassword, 12);
  const createdResidents = [];
  for (const profile of residents) {
    createdResidents.push(await getOrCreateResident(profile, passwordHash));
  }

  for (const name of incomeCategories) await ensureCategory(name, 'income');
  for (const name of expenseCategories) await ensureCategory(name, 'expense');

  const now = new Date();
  const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const previousMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const currentMonthName = monthLabel(currentMonth);
  const previousMonthName = monthLabel(previousMonth);

  for (const [index, resident] of createdResidents.entries()) {
    const monthlyAmount = residents[index].maintenanceAmount;
    const paidDue = await MaintenanceDue.findOneAndUpdate(
      { resident: resident._id, month: previousMonthName, category: 'Maintenance Charges' },
      {
        $setOnInsert: {
          resident: resident._id,
          month: previousMonthName,
          category: 'Maintenance Charges',
          amount: monthlyAmount,
          penalty: 0,
          paidAmount: monthlyAmount,
          dueDate: dateInMonth(previousMonth, 5),
          status: 'paid',
        },
      },
      { upsert: true, new: true },
    );

    const receiptNo = `SAMPLE-${String(index + 1).padStart(2, '0')}-${previousMonthName.replace(' ', '-').toUpperCase()}`;
    const payment = await Payment.findOneAndUpdate(
      { receiptNo },
      {
        $setOnInsert: {
          resident: resident._id,
          dues: [paidDue._id],
          amount: monthlyAmount,
          date: dateInMonth(previousMonth, 10),
          month: previousMonthName,
          category: 'Maintenance Charges',
          paymentMode: ['UPI', 'Bank Transfer', 'Cash', 'Card', 'Cheque'][index],
          transactionId: `SAMPLE-TXN-${String(index + 1).padStart(3, '0')}`,
          receiptNo,
          status: 'completed',
          recordedBy: admin._id,
        },
      },
      { upsert: true, new: true },
    );

    await Income.updateOne(
      { sourcePaymentId: payment._id },
      {
        $setOnInsert: {
          description: `Resident payment - ${previousMonthName}`,
          category: 'Maintenance Charges',
          amount: monthlyAmount,
          date: payment.date,
          paymentMode: payment.paymentMode,
          transactionRef: payment.transactionId,
          resident: resident._id,
          residentName: residents[index].name,
          flat: `${residents[index].wing}-${residents[index].flatNo}`,
          sourcePaymentId: payment._id,
          createdBy: admin._id,
          remarks: 'Local sample data',
        },
      },
      { upsert: true },
    );

    await MaintenanceDue.updateOne(
      { resident: resident._id, month: currentMonthName, category: 'Maintenance Charges' },
      {
        $setOnInsert: {
          resident: resident._id,
          month: currentMonthName,
          category: 'Maintenance Charges',
          amount: monthlyAmount,
          penalty: 0,
          paidAmount: 0,
          dueDate: dateInMonth(currentMonth, 5),
          status: 'pending',
        },
      },
      { upsert: true },
    );
  }

  const expenseFixtures = [
    { description: `Sample security service - ${currentMonthName}`, category: 'Security Services', vendor: 'Sample Security Services', amount: 18000, day: 2 },
    { description: `Sample housekeeping - ${currentMonthName}`, category: 'Housekeeping', vendor: 'Sample Housekeeping', amount: 9500, day: 3 },
    { description: `Sample common electricity - ${currentMonthName}`, category: 'Common Area Electricity', vendor: 'Sample Electricity Board', amount: 7200, day: 4 },
  ];

  for (const fixture of expenseFixtures) {
    const date = dateInMonth(currentMonth, fixture.day);
    await Expense.updateOne(
      { description: fixture.description, vendor: fixture.vendor },
      {
        $setOnInsert: {
          description: fixture.description,
          category: fixture.category,
          vendor: fixture.vendor,
          amount: fixture.amount,
          date,
          paymentStatus: 'Paid',
          paymentMode: 'Bank Transfer',
          transactionRef: `SAMPLE-${fixture.category.replaceAll(' ', '-').toUpperCase()}`,
          hasInvoice: false,
          remarks: 'Local sample data',
          createdBy: admin._id,
          updatedBy: admin._id,
        },
      },
      { upsert: true },
    );
  }

  await MaintenanceSchedule.updateOne(
    { title: 'Sample lift inspection', description: 'Local sample data' },
    {
      $setOnInsert: {
        title: 'Sample lift inspection',
        date: dateInMonth(currentMonth, 20),
        time: '10:00 AM',
        description: 'Local sample data',
        status: 'scheduled',
        createdBy: admin._id,
      },
    },
    { upsert: true },
  );

  console.info('Sample data is ready: 5 residents, 5 paid receipts, 5 pending dues, income, expenses, categories, and one maintenance schedule.');
  console.info(`Resident test login password: ${samplePassword}`);
  console.info('Resident emails:');
  for (const profile of residents) console.info(`  ${profile.email}`);
  console.info('These accounts use reserved .test emails and are for local testing only.');
};

seedSampleData()
  .catch((error) => {
    console.error('Could not add sample data:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
