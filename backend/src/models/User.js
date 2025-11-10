const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }, { collection: "users" }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

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

module.exports = mongoose.model('User', userSchema);