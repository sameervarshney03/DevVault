const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected to MongoDB.");
  const users = await User.find({});
  console.log("Users in database:", users);
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
});
