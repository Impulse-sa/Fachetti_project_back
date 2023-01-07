const jwt = require("jsonwebtoken")
const { RANDOM_TOKEN } = process.env;

const { User, Role } = require("../db");

module.exports = (roles) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = await jwt.verify(token, RANDOM_TOKEN)
        console.log(decodedToken)
        const userData = await User.findByPk(decodedToken.userId)
        const role = await Role.findByPk(userData.roleId)

        if ([].concat(roles).includes(role.name)) {
            next()
        } else {
            res.status(409).json('Peticion no valida, faltan credenciales')
        }

    } catch (error) {
        res.status(409).json('Peticion no valida, faltan credenciales')
    }
}