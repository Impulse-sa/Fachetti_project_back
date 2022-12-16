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
  const result = [];

  try {
    const users = await User.findAll();
    console.log('users: ',users)

    if (!users) return null;

    users.forEach( (u) =>{
      result.push({
        id: u.id,
        email: u.email,
      });
    })

    console.log('result: ', result)
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
