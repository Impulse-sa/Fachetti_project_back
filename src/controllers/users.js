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

    const user = await User.findByPk(data.userId)
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
    if (!updatedUser) throw new Error('Usuario no actualizado')
    
    const user = await User.findByPk(id)
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

const deleteUser = async (id) => {
  try {
    const dbResult = await Category.destroy(
      {
        where: {
          id
        }
      }
    )
    return dbResult
  } catch (error) {
    throw new Error(error.message);
  }
}

const validatePassword = async (email,password) => {
  const user = await User.findOne({ where: { email } });
    const validatePassword = await bcrypt.compare(password, user.password)
    if (!validatePassword) throw new Error('Invalid Password')
    else return user
}

const validateUserToken = async (token) => {
  const user = await User.findOne({where: {token}});
    if (!user) throw new Error('Invalid Token')
    else return user
}

const changePassword = async (user,newPassword) => {
  const updatedUser = User.update(
    {
      password: await bcrypt.hash(newPassword, 10),
    },
    {
      where: {
        id: user.id
      }
    }
  )
  return updatedUser
}

const checkEmail = async (email) => {
  try {
    const emailExist = await User.findOne({
      where: {
        email,
      },
    });
    if (!emailExist) {
     throw new Error('Email does not exist')
    }
    return emailExist
    
  } catch (error) {
    throw new Error(error.message);
  }
}

const updateUserAtribute = async (id,key,value) => {
  try {
    const userUpdate = await User.update(
      {
        [key]:value
      },
      {
        where: {
          id
        }
      }
    )
    if (!userUpdate) throw new Error('Usuario no actualizado')

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
  deleteUser,
  validatePassword,
  changePassword,
  checkEmail,
  updateUserAtribute,
  validateUserToken
};
