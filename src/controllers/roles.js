const { Role } = require("../db");
const { v4: uuidv4 } = require("uuid");


const createRole = async (name, description) => {
    try {
        const role = await Role.create({
            id: uuidv4(),
            name,
            description
        })
    
        return role     
    } catch (error) {
        throw new Error(error.message)
    }
}

const getAllRoles = async () => {
    try {
        const roles = await Role.findAll()
        return roles
    } catch (error) {
        throw new Error(error.message)
    }
}

const getRole = async (id) => {
    try {
        const role = await Role.findByPk(id)
        return role
    } catch (error) {
        throw new Error(error.message)  
    }
}

const bannedRole = async (id, isBanned) => {
    try {
        const dbResult = await Role.update(
            {
                isBanned
            },
            {
                where: {
                    id
                }
            }
        )
        if (!dbResult) throw new Error('Rol no encontrado')

        const role = await Role.findByPk(id)
        return role
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateRole = async (id, name, description) => {
    try {
        const dbResult = await Role.update(
            {
                name,
                description
            },
            {
                where: {
                    id
                }
            }
        )
        if (!dbResult) throw new Error('Rol no encontrado')

        const role = await Role.findByPk(id)
        return role
    } catch (error) {
        throw new Error(error.message)
    }
}

const deleteRole = async (id) => {
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

module.exports = {
    createRole,
    getAllRoles,
    getRole,
    bannedRole,
    updateRole,
    deleteRole
}