const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find();
  console.log('Users:');
  users.forEach(u => console.log(u.email, 'walletBalance:', u.walletBalance));
  process.exit(0);
};
run();
