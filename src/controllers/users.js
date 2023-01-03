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
      fullName: dbResult.fullName,
      profileImage: dbResult.profileImage,
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
        fullName: u.fullName,
        profileImage: u.profileImage,
      });
    })

    console.log('result: ', result)
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUser = async (email, password, fullName, profileImage) => {
  try {
    const userCreated = await User.create({
      id: uuidv4(),
      email,
      password: await bcrypt.hash(password, 10),
      fullName,
      profileImage      
    });
    return userCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (id, data) => {
  try {
    const updatedUser = await User.update(
      {
        fullName: data.fullName,
        profileImage: data.profileImage
      },
      {
        where: {
        id
        }
      }
    )
    const user = await User.findByPk(id)
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser
};
