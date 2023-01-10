const {validationResult}=require('express-validator')
const { User, Category } = require("../db");

const validateResult = (req,res,next)=>{
    try {
        validationResult(req).throw()
        return next()
    } catch (error) {
        res.status(403).json(error.array())
    }
}

const validateName = ( value, str = 'name') => {
    const regExName = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s+[a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$/

    if (!regExName.test(value)) {
      throw new Error(`${str} is not valid`);
    }
    // Indicates the success of this synchronous custom validator
    return true;
}

const validateImage = value => {
    if (value) {
      const regExName = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi

      if (!regExName.test(value)) {
        throw new Error('Is not a valid image url');
      } 
    }
    // Indicates the success of this synchronous custom validator
    return true;
  }

const validatePassword = value => {
  const regExpassword = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/

  if (regExpassword.test(value)) {
    throw new Error('Password is not valid. Must have 1 Uper case, 3 lower case, 2 numbers, and 1 special character. Min length 8 char')
  }
  // Indicates the success of this synchronous custom validator
  return true;
}

const validateExistCategory = async (value) => {
  const categoryExist = await Category.findOne({ where: { name: value } });
  return categoryExist
}
const findUser = async (email) => {
  var userEmail = await User.findOne({ where: { email } });
  return userEmail
}

module.exports = {
    validateResult,
    validateName,
    validateImage,
    validatePassword,
    findUser,
    validateExistCategory
}