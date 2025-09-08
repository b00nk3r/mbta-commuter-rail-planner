const asyncHandler = require('../middleware/asyncHandler');
const { newUserValidation } = require('../models/userValidator');
const userService = require('../services/userService');
const { generateAccessToken } = require('../utilities/generateToken');

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.validatedBody || req.body;

  const existing = await userService.findByUsername(username);
  if (existing) return res.status(409).send({ message: 'Username is taken, pick another' });

  const saved = await userService.createUser({ username, email, password });
  res.send(saved);
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.validatedBody || req.body;

  const user = await userService.authenticate(username, password);
  if (!user) return res.status(401).send({ message: 'email or password does not exists, try again' });

  const accessToken = generateAccessToken(user._id, user.email, user.username, user.password);
  res.header('Authorization', accessToken).send({ accessToken });
});

const getAll = asyncHandler(async (req, res) => {
  const users = await userService.findAllUsers();
  res.json(users);
});

const getById = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await userService.findUserById(userId);
  if (!user) return res.status(404).send('userId does not exist.');
  res.json(user);
});

const editUser = asyncHandler(async (req, res) => {
  const { error, data } = newUserValidation(req.body);
  if (error) return res.status(400).send({ message: error.errors[0].message });

  const { userId, username, email, password } = data;
  const existing = await userService.findByUsername(username);
  if (existing) {
    const existingId = String(existing._id);
    if (existingId !== String(userId)) {
      return res.status(409).send({ message: 'Username is taken, pick another' });
    }
  }

  const updated = await userService.updateUser({ userId, username, email, password });
  const accessToken = generateAccessToken(updated._id, email, username, updated.password);
  res.header('Authorization', accessToken).send({ accessToken });
});

const deleteAll = asyncHandler(async (req, res) => {
  const result = await userService.deleteAllUsers();
  res.json(result);
});

module.exports = { signup, login, getAll, getById, editUser, deleteAll };