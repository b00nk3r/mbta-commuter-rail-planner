const bcrypt = require('bcrypt');
const User = require('../models/userModel');

function findAllUsers() {
  return User.find();
}

function findUserById(id) {
  return User.findById(id);
}

function findByUsername(username) {
  return User.findOne({ username });
}

async function createUser({ username, email, password }) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = new User({ username, email, password: hash });
  return user.save();
}

async function updateUser({ userId, username, email, password }) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return User.findByIdAndUpdate(userId, { username, email, password: hash });
}

function deleteAllUsers() {
  return User.deleteMany();
}

async function authenticate(username, password) {
  const user = await findByUsername(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  return ok ? user : null;
}

module.exports = {
  findAllUsers,
  findUserById,
  findByUsername,
  createUser,
  updateUser,
  deleteAllUsers,
  authenticate
};