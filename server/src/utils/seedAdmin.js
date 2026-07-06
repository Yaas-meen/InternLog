import mongoose from 'mongoose';
import dotenv   from 'dotenv';
import User     from '../models/User.model.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@internlog.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      firstName:  'Amina',
      lastName:   'Yakubu',
      email:      'admin@internlog.com',
      password:   'Admin@1234',
      role:       'admin',
      department: 'Administration',
    });

    console.log(' Admin seeded: admin@internlog.com / Admin@1234');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();