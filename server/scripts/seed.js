/**
 * NA AI Systems — Database Seeder
 * Usage:  node server/scripts/seed.js
 *
 * Creates:
 *   Admin user  → admin@naaisystems.com / Admin@123
 *   Demo user   → demo@naaisystems.com  / Demo@123
 *   Sample contact submission
 *
 * Safe to run multiple times (upserts, never duplicates).
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  company: String,
  isActive: { type: Boolean, default: true },
  aiUsageCount: { type: Number, default: 0 },
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  message: String,
  status: { type: String, default: 'new' },
}, { timestamps: true });

const User    = mongoose.models.User    || mongoose.model('User',    userSchema);
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

const upsertUser = async ({ name, email, password, role, company }) => {
  const hashed = await bcrypt.hash(password, 12);
  return User.findOneAndUpdate(
    { email },
    { name, email, password: hashed, role, company, isActive: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>')) {
    console.error('\n  MONGODB_URI is not configured in server/.env');
    console.error('  Edit server/.env, replace the placeholder, then re-run.\n');
    process.exit(1);
  }

  console.log('\n  Connecting to MongoDB Atlas...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('  Connected.\n');

  const admin = await upsertUser({
    name: 'NA Admin',
    email: 'admin@naaisystems.com',
    password: 'Admin@123',
    role: 'admin',
    company: 'NA AI Systems',
  });
  console.log('  Admin  ->', admin.email, '| role:', admin.role);

  const demo = await upsertUser({
    name: 'Demo User',
    email: 'demo@naaisystems.com',
    password: 'Demo@123',
    role: 'user',
    company: 'Demo Corp',
  });
  console.log('  Demo   ->', demo.email, '| role:', demo.role);

  const existing = await Contact.findOne({ email: 'investor@example.com' });
  if (!existing) {
    await Contact.create({
      name: 'Sample Investor',
      email: 'investor@example.com',
      company: 'Green Capital Fund',
      message: 'We are interested in learning more about your AI platform.',
      status: 'new',
    });
    console.log('  Sample contact created.');
  }

  console.log('\n  Seed complete!');
  console.log('  Admin  -> admin@naaisystems.com  /  Admin@123');
  console.log('  Demo   -> demo@naaisystems.com   /  Demo@123\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('\n  Seed failed:', err.message, '\n');
  process.exit(1);
});
