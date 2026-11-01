import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import User from '../models/User.js';

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!name || !email || !password || password.length < 10) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and an ADMIN_PASSWORD of at least 10 characters in server/.env.');
  }

  await connectDatabase();
  const existingAdmin = await User.findOne({ role: 'admin' }).select('_id email');
  if (existingAdmin) throw new Error(`An admin account already exists (${existingAdmin.email}); refusing to replace it.`);

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ name, email, passwordHash, role: 'admin', status: 'active', profileComplete: true });
  console.info(`Created initial administrator account for ${email}.`);
};

createAdmin()
  .catch((error) => {
    console.error('Could not create initial administrator:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import('mongoose');
    await mongoose.default.disconnect();
  });
