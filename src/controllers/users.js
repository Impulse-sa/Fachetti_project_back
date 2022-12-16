const { User } = require("../db");

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const getUserById = async (id) => {
  try {
    const dbResult = await User.findByPk(id);

    if (!dbResult) return null;

    const result = {
      id: dbResult.id,
      email: dbResult.email,
    };

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUsers = async () => {
  try {
    const dbResult = await User.findAll();

    if (!dbResult) return null;

    const result = {
      id: dbResult.id,
      email: dbResult.email,
    };

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUser = async (email, password) => {
  try {
    const userCreated = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      id: uuidv4(),
    });
    return userCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers
};
