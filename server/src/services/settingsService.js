import Category from '../models/Category.js';
import SocietySettings from '../models/SocietySettings.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

const defaultSettings = {
  key: 'primary',
  name: 'SocietyVault Society',
  currency: 'INR',
};

export const getSettings = async () => {
  const [society, categoryDocuments, users] = await Promise.all([
    SocietySettings.findOneAndUpdate(
      { key: 'primary' },
      { $setOnInsert: defaultSettings },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean(),
    Category.find().sort({ type: 1, name: 1 }).lean(),
    User.find({ role: 'admin' }).select('email role status lastLoginAt createdAt').sort({ createdAt: 1 }).lean(),
  ]);
  return {
    society,
    categories: {
      income: categoryDocuments.filter((category) => category.type === 'income'),
      expense: categoryDocuments.filter((category) => category.type === 'expense'),
    },
    users: users.map((user) => ({
      ...user,
      name: user.email,
      role: user.role === 'admin' ? 'Administrator' : user.role,
    })),
    roles: ['Administrator'],
  };
};

export const updateSettings = async (data) => {
  const society = await SocietySettings.findOneAndUpdate(
    { key: 'primary' },
    { $set: data, $setOnInsert: defaultSettings },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );
  return society;
};

export const createCategory = (data) => Category.create(data);

export const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found.');
  return category;
};

export const removeCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, 'Category not found.');
  return category;
};
