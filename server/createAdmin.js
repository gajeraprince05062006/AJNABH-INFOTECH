/**
 * Create Admin User CLI Script
 * Usage: node createAdmin.js <username> <password>
 * 
 * This script creates a new admin user with a bcrypt-hashed password.
 * If the username already exists, it updates the password.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node createAdmin.js <username> <password>');
  console.error('Example: node createAdmin.js admin MyStrongP@ssw0rd');
  process.exit(1);
}

const [username, password] = args;

if (username.length < 3 || username.length > 50) {
  console.error('Error: Username must be between 3 and 50 characters.');
  process.exit(1);
}

if (password.length < 6 || password.length > 128) {
  console.error('Error: Password must be between 6 and 128 characters.');
  process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Error: MONGO_URI not set in .env file.');
  process.exit(1);
}

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const existing = await User.findOne({ username }).select('+password');
    if (existing) {
      // Update password for existing user (re-hash)
      existing.password = password;
      await existing.save();
      console.log(`Admin user "${username}" password updated with bcrypt hash.`);
    } else {
      const user = new User({ username, password });
      await user.save();
      console.log(`Admin user "${username}" created successfully with hashed password.`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  }
}

createAdmin();
