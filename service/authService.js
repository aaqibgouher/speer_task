const { UserModel, TokenModel } = require("../model");
const { isEmail } = require("../utils/commonUtil");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (payload) => {
  // validate
  if (!payload || !payload.name || !payload.name.trim())
    throw "Name is required";
  if (!payload || !payload.email || !payload.email.trim())
    throw "Email is required";
  if (!payload || !payload.password || !payload.password.trim())
    throw "Password is required";

  // taking value
  const { name, email, password, role } = payload;

  // if not valid email
  if (!isEmail(email)) throw "Email is not valid";

  // check if user exist by that email, if exists throw error
  let user = await getUserByEmail(email);

  //   if user already exists
  if (user)
    throw "User already exist with this email, please use another email";

  // if not, create user
  user = new UserModel({
    name,
    email,
    password: await encodePassword(password),
    role,
  });

  //   saving
  await user.save();

  //   return
  return {
    name,
    email,
  };
};

const login = async (payload) => {
  // validate
  if (!payload || !payload.email || !payload.email.trim())
    throw "Email is required";
  if (!payload || !payload.password || !payload.password.trim())
    throw "Password is required";

  // taking value
  const { email, password } = payload;

  //   if not valid email
  if (!isEmail(email)) throw "Email invalid";

  // check if user exist by that email, if exists throw error
  let user = await getUserByEmail(email, true);

  //   if user not exists
  if (!user) throw "Invalid email";

  //   check for password
  if (!(await isPasswordCorrect(password, user.password)))
    throw "Email/Password is invalid";

  //   generate the token
  const token = await generateToken({ userId: user._id });

  // save on tokens table
  await TokenModel.create({
    user: user._id,
    token,
  });

  //   returning
  return {
    email,
    token,
    userId: user._id,
  };
};

const logout = async (payload) => {
  // taking value
  const { userId, token } = payload;

  //   remove token from db
  return TokenModel.deleteOne({ user: userId, token });
};

// get user by email, default not fetch password else do
const getUserByEmail = async (email, password = false) => {
  return password
    ? await UserModel.findOne({ email })
    : await UserModel.findOne({ email }).select("-password");
};

// encoding password using bcrypt
const encodePassword = async (password) => {
  const saltRounds = process.env.SALT_ROUNDS;
  return await bcrypt.hash(password, +saltRounds);
};

// check hased password with user input password using bcrypt
const isPasswordCorrect = async (password, correctPassword) => {
  return await bcrypt.compare(password, correctPassword);
};

// generates token
const generateToken = async (payload) => {
  return await jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" });
};

// verify token
const verifyToken = async (payload) => {
  return await jwt.verify(payload.token, process.env.TOKEN_SECRET);
};

// get user by id, default password hidden else do
const getUserById = async (id, password = false) => {
  return password
    ? await UserModel.findOne({ _id: id })
    : await UserModel.findOne({ _id: id }).select("-password");
};

// get user token by user & token
const getUserTokenByUserIdAndToken = async (userId, token) => {
  return await TokenModel.findOne({ user: userId, token });
};

module.exports = {
  register,
  getUserByEmail,
  generateToken,
  login,
  isPasswordCorrect,
  encodePassword,
  verifyToken,
  getUserById,
  getUserTokenByUserIdAndToken,
  logout,
};
