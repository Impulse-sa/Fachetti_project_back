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

const createUser = async (email, password, fullName, profileImage, roleId) => {
  try {
    const userCreated = await User.create({
      id: uuidv4(),
      email,
      password: await bcrypt.hash(password, 10),
      fullName,
      profileImage,
      roleId
    });
    return userCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (data) => {
  try {
    const updatedUser = await User.update(
      {
        fullName: data.fullName,
        profileImage: data.profileImage
      },
      {
        where: {
        id: data.userId
        }
      }
    )
    if (!updatedUser) throw new Error('Usuario no encontrado')

    const user = await User.findByPk(id)
    return user;
  
  } catch (error) {
    throw new Error(error.message);
  }
}

const bannedUser = async (id, isBanned) => {
  try {
    const userBanned = await User.update(
      {
        isBanned
      },
      {
        where: {
        id
        }
      }
    )
    if (!userBanned) throw new Error('Usuario no encontrado')

    const user = await User.findByPk(id)
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

const updateRoleUser = async (id, roleId) => {
  try {
    const updatedUser = await User.update(
      {
        roleId
      },
      {
        where: {
        id
        }
      }
    )
    if (!updatedUser) throw new Error('Usuario no encontrado')
    
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
  updateUser,
  bannedUser,
  updateRoleUser,

};
