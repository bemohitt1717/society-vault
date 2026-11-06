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
import SocietySettings from '../models/SocietySettings.js';
import User from '../models/User.js';

const residents = [
  { name: 'Geetansh', email: 'geetansh@gmail.com', password: 'geetansh123', phone: '9000000001', wing: 'A', flatNo: '101', type: 'Owner', maintenanceAmount: 3500 },
  { name: 'Sahil', email: 'sahil@gmail.com', password: 'sahil123', phone: '9000000002', wing: 'A', flatNo: '102', type: 'Owner', maintenanceAmount: 3500 },
  { name: 'Shivam', email: 'shivam@gmail.com', password: 'shivam123', phone: '9000000003', wing: 'B', flatNo: '201', type: 'Tenant', maintenanceAmount: 4200 },
  { name: 'Ishuu', email: 'ishuu@gmail.com', password: 'ishuu123', phone: '9000000004', wing: 'B', flatNo: '202', type: 'Owner', maintenanceAmount: 4200 },
  { name: 'Dhansikha', email: 'dhansikha@gmail.com', password: 'dhansikha123', phone: '9000000005', wing: 'C', flatNo: '301', type: 'Tenant', maintenanceAmount: 5000 },
];

const incomeCategories = ['Maintenance Charges', 'Other Income'];
const expenseCategories = ['Security Services', 'Housekeeping', 'Common Area Electricity'];
const paymentModes = ['UPI', 'Bank Transfer', 'Cash', 'Card', 'Cheque'];
const productionDemoDatabaseName = 'societyvault_demo';

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
      && existing.profile?.name === profile.name
      && existing.profile?.wing === profile.wing
      && existing.profile?.flatNo === profile.flatNo;
    if (!matchesFixture) {
      throw new Error(`The sample account email ${profile.email} is already in use by another record. No existing account was changed.`);
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
  if (!process.argv.includes('--confirm')) {
    throw new Error('To add local sample data, run: npm run seed:sample-data -- --confirm');
  }
  if (env.NODE_ENV === 'production' && !process.argv.includes('--allow-production-demo')) {
    throw new Error('Production demo seeding requires --allow-production-demo and the dedicated societyvault_demo database.');
  }

  await connectDatabase();

  if (env.NODE_ENV === 'production' && mongoose.connection.name !== productionDemoDatabaseName) {
    throw new Error(`Production demo data may only be seeded into "${productionDemoDatabaseName}". Connected to "${mongoose.connection.name}"; no sample data was changed.`);
  }

  const admin = await User.findOne({ role: 'admin', status: 'active' }).select('_id');
  if (!admin) {
    throw new Error('Create an administrator first with npm run seed:admin, then run this command again.');
  }

  console.info(`Adding local sample data to database "${mongoose.connection.name}".`);
  const createdResidents = [];
  for (const profile of residents) {
    const passwordHash = await bcrypt.hash(profile.password, 12);
    createdResidents.push(await getOrCreateResident(profile, passwordHash));
  }

  for (const name of incomeCategories) await ensureCategory(name, 'income');
  for (const name of expenseCategories) await ensureCategory(name, 'expense');

  const now = new Date();
  const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const currentMonthName = monthLabel(currentMonth);
  const recentMonths = Array.from({ length: 6 }, (_, index) => (
    new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 5 + index, 1))
  ));
  const monthToken = (date) => `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  const financialYearStart = currentMonth.getUTCMonth() >= 3
    ? currentMonth.getUTCFullYear()
    : currentMonth.getUTCFullYear() - 1;
  const financialYear = `${financialYearStart}-${String(financialYearStart + 1).slice(-2)}`;

  await SocietySettings.findOneAndUpdate(
    { key: 'primary' },
    {
      $set: {
        name: 'SocietyVault Demo Society',
        financialYear,
        currency: 'INR',
        maintenanceAmount: 3500,
        dueDate: 5,
        lateFeePercentage: 1,
      },
      $setOnInsert: { key: 'primary' },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  for (const [index, resident] of createdResidents.entries()) {
    const monthlyAmount = residents[index].maintenanceAmount;
    for (let monthIndex = 0; monthIndex < recentMonths.length - 1; monthIndex += 1) {
      const dueMonth = recentMonths[monthIndex];
      const paymentMonth = recentMonths[monthIndex + 1];
      const dueMonthName = monthLabel(dueMonth);
      const paidDue = await MaintenanceDue.findOneAndUpdate(
        { resident: resident._id, month: dueMonthName, category: 'Maintenance Charges' },
        {
          $setOnInsert: {
            resident: resident._id,
            month: dueMonthName,
            category: 'Maintenance Charges',
            amount: monthlyAmount,
            penalty: 0,
            paidAmount: monthlyAmount,
            dueDate: dateInMonth(dueMonth, 5),
            status: 'paid',
          },
        },
        { upsert: true, new: true },
      );

      if (paidDue.paidAmount <= 0 || paidDue.paidAmount > paidDue.amount + paidDue.penalty) {
        throw new Error(`Paid maintenance due for ${resident.profile.name} has an invalid paid amount.`);
      }

      const receiptNo = `DEMO-R${index + 1}-${monthToken(dueMonth)}`;
      const paymentData = {
        resident: resident._id,
        dues: [paidDue._id],
        amount: paidDue.paidAmount,
        date: dateInMonth(paymentMonth, index + 1),
        month: dueMonthName,
        category: 'Maintenance Charges',
        paymentMode: paymentModes[(index + monthIndex) % paymentModes.length],
        transactionId: `DEMO-MAINT-R${index + 1}-${monthToken(dueMonth)}`,
        receiptNo,
        status: 'completed',
        recordedBy: admin._id,
      };
      let payment = await Payment.findOne({
        resident: resident._id,
        dues: paidDue._id,
        status: 'completed',
      });
      if (payment) {
        payment.set(paymentData);
        await payment.save();
      } else {
        payment = await Payment.create(paymentData);
      }

      await Income.findOneAndUpdate(
        { sourcePaymentId: payment._id },
        {
          $set: {
            description: `Maintenance payment - ${dueMonthName}`,
            category: 'Maintenance Charges',
            amount: payment.amount,
            date: payment.date,
            paymentMode: payment.paymentMode,
            transactionRef: payment.transactionId,
            resident: resident._id,
            residentName: residents[index].name,
            flat: `${residents[index].wing}-${residents[index].flatNo}`,
            sourcePaymentId: payment._id,
            createdBy: admin._id,
            remarks: 'Demo data',
          },
        },
        { upsert: true, new: true, runValidators: true },
      );
    }

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

  const otherIncomeFixtures = recentMonths.flatMap((month) => {
    const token = monthToken(month);
    const label = monthLabel(month);
    return [
      { description: `Community hall bookings - ${label}`, category: 'Other Income', amount: 15000, day: 10, transactionRef: `DEMO-HALL-${token}`, month },
      { description: `Resident parking collections - ${label}`, category: 'Other Income', amount: 20000, day: 20, transactionRef: `DEMO-PARKING-${token}`, month },
    ];
  });

  for (const fixture of otherIncomeFixtures) {
    const day = fixture.month.getTime() === currentMonth.getTime()
      ? Math.min(fixture.day, now.getUTCDate())
      : fixture.day;
    await Income.findOneAndUpdate(
      { transactionRef: fixture.transactionRef },
      {
        $set: {
          description: fixture.description,
          category: fixture.category,
          amount: fixture.amount,
          date: dateInMonth(fixture.month, day),
          paymentMode: 'Bank Transfer',
          transactionRef: fixture.transactionRef,
          resident: null,
          residentName: '',
          flat: '',
          remarks: 'Demo data',
          createdBy: admin._id,
        },
      },
      { upsert: true, new: true, runValidators: true },
    );
  }

  const expenseFixtures = recentMonths.flatMap((month) => {
    const label = monthLabel(month);
    return [
      { description: `Sample security service - ${label}`, category: 'Security Services', vendor: 'Sample Security Services', amount: 18000, day: 2, month },
      { description: `Sample housekeeping - ${label}`, category: 'Housekeeping', vendor: 'Sample Housekeeping', amount: 9700, day: 3, month },
      { description: `Sample common electricity - ${label}`, category: 'Common Area Electricity', vendor: 'Sample Electricity Board', amount: 7200, day: 4, month },
    ];
  });

  for (const fixture of expenseFixtures) {
    const date = dateInMonth(fixture.month, fixture.day);
    await Expense.updateOne(
      { description: fixture.description, vendor: fixture.vendor },
      {
        $set: {
          description: fixture.description,
          category: fixture.category,
          vendor: fixture.vendor,
          amount: fixture.amount,
          date,
          paymentStatus: 'Paid',
          paymentMode: 'Bank Transfer',
          transactionRef: `DEMO-${fixture.category.replaceAll(' ', '-').toUpperCase()}-${monthToken(fixture.month)}`,
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

  console.info('Sample data is ready: 5 resident profiles, 25 paid receipts, 5 outstanding dues, six months of income/expenses, categories, settings, and one maintenance schedule.');
  console.info('Resident test login credentials (for this disposable test database only):');
  for (const profile of residents) console.info(`  ${profile.email} / ${profile.password}`);
};

seedSampleData()
  .catch((error) => {
    console.error('Could not add sample data:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
