const { Router } = require("express");
const router = Router();

const { User } = require("../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const userController = require("../controllers/users");
const {validateUserCreate, validateUserLogin, validateUserUpdate, validateUserBanned, validateChangePassword, validateEmail, validateNewPassword} = require('../validator/users')

const jwt = require("jsonwebtoken");
const auth = require('../config/auth')
const authRole = require('../config/authRole');
const { sendMail } = require("../utils/emailer");
const { htmlTemplateChangePassword } = require("../../public/ChangePassword");
const { RANDOM_TOKEN, URL_FRONT } = process.env;

router.post("/login", validateUserLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const userEmail = await userController.validatePassword(email,password)
  
    const token = jwt.sign(
      {
        userId: userEmail.id,
        email: userEmail.email,
        fullName: userEmail.fullName,
        profileImage: userEmail.profileImage,
      },
      RANDOM_TOKEN,
      { expiresIn: "24h" }
    );

    res.status(200).json(token);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", authRole(['globalAdmin']), validateUserCreate, async (req, res) => {
  const { email, password, fullName, profileImage, roleId } = req.body;

  try {
    //Reemplazar por checkUserEmail
    const emailExist = await User.findOne({
      where: {
        email,
      },
    });

    if (emailExist) {
      return res.status(400).json(req.t(`users.user_already_exist`))
    }

    const userCreated = await userController.createUser(email, password, fullName, profileImage, roleId);

    res.status(201).json(userCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get('/', authRole(['globalAdmin']), async (req,res)=>{

  try {
    const users = await userController.getAllUsers()
    if (!users.length) {
      return res.status(200).json(req.t('users.users_not_found'));
    }
    res.status(200).json(users)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.get('/:id', auth, async (req,res)=>{
  const {id} = req.params

  try {
    const user = await userController.getUserById(id)
    console.log(user)
    if (!user) {
      return res.status(200).json(req.t('users.user_not_found'));
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/', auth, validateUserUpdate, async (req,res)=>{
  const data = req.body

  try {
    const user = await userController.updateUser(data)
    if (!user) {
      return res.status(200).json(req.t('users.user_not_found'));
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
      },
      RANDOM_TOKEN,
      { expiresIn: "24h" }
    );

    res.status(200).json(token)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/banned/:id', authRole(['globalAdmin']), validateUserBanned, async (req, res)=>{
  const {id} = req.params;
  const {isBanned} = req.query;

  try {
    const userBanned = await userController.bannedUser(id, isBanned)
    res.status(201).json(userBanned)

  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/changePassword', auth, validateChangePassword, async (req,res)=> {
  const {email, password, newPassword} = req.body

  try {
    const user = await userController.validatePassword(email, password)
    const userUpdated = await userController.changePassword(user, newPassword)
    if (userUpdated) return res.status(200).json(req.t('users.password_updated'))
    else return res.status(400).json(req.t('something_wrong'))

  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/forgotPassword', validateEmail, async (req,res) => {
  const {email} = req.body;
  
  try {
    const user = await userController.checkEmail(email)
    const token = jwt.sign(
      {
        userId: user.id,
        email,
      },
      RANDOM_TOKEN,
      { expiresIn: "10m" }
    );

    userController.updateUserAtribute(user.id,'token',token) //async

    const link = `${URL_FRONT}/forgotPassword/${token}`
    const subject = req.t('users.change_password_subject')

    const emailStatus = await sendMail(email,subject,user.name, htmlTemplateChangePassword(link))

    if (emailStatus === 'OK') res.status(200).json(req.t('users.check_email'))
    
    else res.status(400).json(req.t('something_wrong'))
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.put('/newPassword', auth,   async (req,res)=>{
  const token = req.headers.authorization.split(' ')[1]
  const {id, newPassword} = req.body

  try {
    const user = await userController.validateUserToken(token)
    if (user) {
      const updatedPassword = await userController.changePassword(user,newPassword)
      if (updatedPassword) return res.status(200).json(req.t('users.password_updated'))
      else return res.status(400).json(req.t('something_wrong'))
    }
  } catch (error) {
    res.status(400).send(error.message)

  }
})
router.delete("/:id", authRole(['globalAdmin']), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userController.deleteUser(id);
    if (result) return res.status(200).json(req.t('users.user_deleted'));
    res.status(304).json(req.t('users.user_deleted'))
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
