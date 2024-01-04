const mongoose = require("mongoose");

const isEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const toMongoId = async (id) => {
  return await new mongoose.Types.ObjectId(id);
};
const isValidMongoId = async (id) => {
  return await mongoose.Types.ObjectId.isValid(id);
};

const isMongoEqual = async (from, to) => {
  return await from.equals(to);
};

module.exports = {
  isEmail,
  toMongoId,
  isValidMongoId,
  isMongoEqual,
};
