const { Router } = require("express");
const router = Router();

const { User } = require("../db");
const { v4: uuidv4 } = require("uuid");

const userController = require("../controllers/users");
const {validateUserCreate, validateUserLogin} = require('../validator/users')

const jwt = require("jsonwebtoken");
const { RANDOM_TOKEN } = process.env;

router.post("/login", validateUserLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('llegué')
    const userEmail = await User.findOne({ where: { email } });
    console.log(userEmail)
    const userById = await userController.getUserById(userEmail.id);

    const token = jwt.sign(
      {
        userId: userById.id,
        email: userById.email,
        fullName: userById.fullName,
        profileImage: userById.profileImage,
      },
      RANDOM_TOKEN,
      { expiresIn: "24h" }
    );

    res.status(200).json(token);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", validateUserCreate, async (req, res) => {
  const { email, password, fullName, profileImage } = req.body;

  try {
    const emailExist = await User.findOne({
      where: {
        email,
      },
    });

    if (emailExist) {
      return res
        .status(400)
        .json(req.t('user_already_exist'))
        // .json(
        //   "Existe un usuario con esa dirección de email. Prueba con una nueva!"
        // );
    }

    const userCreated = await userController.createUser(email, password, fullName, profileImage);

    res.status(201).json(userCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get('/', async (req,res)=>{

  try {
    const users = await userController.getAllUsers()
    console.log(users)
    if (!users.length) {
      return res.status(200).json("No se encontraron usuarios");
    }
    res.status(200).json(users)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:id', async (req,res)=>{
  const {id} = req.params

  try {
    const user = await userController.getUserById(id)
    console.log(user)
    if (!user) {
      return res.status(200).json("User not found");
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/:id', async (req,res)=>{
  const {id} = req.params
  const data = req.body

  try {
    const user = await userController.updateUser(id, data)
    console.log(user)
    if (!user) {
      return res.status(200).json("User not found");
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router;
