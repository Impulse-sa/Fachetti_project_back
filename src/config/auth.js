const jwt = require("jsonwebtoken");
const { RANDOM_TOKEN } = process.env;

module.exports = async (req, res, next) => {
  try {
    console.log('req.headers: ', req.headers)
    // const token = await req.headers.authorization.split(" ")[1];
    const token = await req.headers.authorization;

    const decodedToken = await jwt.verify(token, RANDOM_TOKEN);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json("Peticion no valida, faltan credenciales!");
  }
};
