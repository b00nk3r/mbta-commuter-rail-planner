const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    label: "username",
  },
  email: {
    type: String,
    required: true,
    label: "email",
  },
  password: {
    type: String,
    required: true,
    label: "password",
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { collection: "users" });

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.authenticate = async function(username, password) {
  const user = await this.findOne({ username });
  if (!user) return null;
  const ok = await user.comparePassword(password);
  if (!ok) return null;
  return user;
};

module.exports = mongoose.model('users', newUserSchema)