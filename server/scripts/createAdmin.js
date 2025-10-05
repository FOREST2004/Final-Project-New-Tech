import models from '../models/index.js';
import bcrypt from 'bcryptjs';

const { User } = models;

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@admin.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@admin.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin123',
      full_name: 'Administrator',
      phone: '0123456789',
      address: 'Admin Address',
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    console.log('User ID:', adminUser.user_id);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

createAdminUser();