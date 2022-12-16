const { Router } = require("express");
const router = Router();

const { v4: uuidv4 } = require("uuid");

const { User } = require("../db");
const userController = require("../controllers/users");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { RANDOM_TOKEN } = process.env;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) return res.status(400).json("Falta email del usuario!");
    if (!password) return res.status(400).json("Falta password del usuario!");

    const userEmail = await User.findOne({ where: { email } });
    if (!userEmail) throw new Error("Email no encontrado!");

    const passwordMatch = await bcrypt.compare(password, userEmail.password);
    if (!passwordMatch) throw new Error("Password incorrecto!");

    const userById = await userController.getUserById(userEmail.id);

    const token = jwt.sign(
      {
        userId: userById.id,
        email: userById.email,
      },
      RANDOM_TOKEN,
      { expiresIn: "24h" }
    );

    res.status(200).json(token);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json("Falta email del usuario!");
  if (!password) return res.status(400).json("Falta password del usuario!");

  try {
    const emailExist = await User.findOne({
      where: {
        email,
      },
    });

    if (emailExist) {
      return res
        .status(400)
        .json(
          "Existe un usuario con esa dirección de email. Prueba con una nueva!"
        );
    }

    const userCreated = await userController.createUser(email, password);

    res.status(201).json(userCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get('/', (req,res)=>{

  try {
    const users = userController.getAllUsers()
    console.log(users)
    if (!users.length) {
      return res.status(200).json("No se encontraron usuarios");
    }
    res.status(200).json(users)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router;
