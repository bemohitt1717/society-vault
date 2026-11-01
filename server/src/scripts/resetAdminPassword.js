import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import User from '../models/User.js';

const resetAdminPassword = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) {
    throw new Error('Set ADMIN_EMAIL and a new ADMIN_PASSWORD of at least 10 characters in server/.env.');
  }

  await connectDatabase();
  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) throw new Error('No administrator account matches ADMIN_EMAIL.');

  admin.passwordHash = await bcrypt.hash(password, 12);
  await admin.save();
  console.info('Administrator password updated.');
};

resetAdminPassword()
  .catch((error) => {
    console.error('Could not update administrator password:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import('mongoose');
    await mongoose.default.disconnect();
  });
