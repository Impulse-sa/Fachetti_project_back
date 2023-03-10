const jwt = require("jsonwebtoken");
const { RANDOM_TOKEN } = process.env;

module.exports = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token, RANDOM_TOKEN);

    if (decodedToken.userId) {
      res.user = decodedToken;
      next();
      
  } else {
    res.status(409).json('Peticion no valida, faltan credenciales')
  }
  } catch (error) {
    res.status(403).json('Peticion no valida, faltan credenciales');
  }
};
