const {check} = require('express-validator')
const { validateResult } = require('../utils/validateHelper')
const { User } = require("../db");
const bcrypt = require("bcryptjs");

const validateUserCreate = [
    check('email')
        .exists()
        .not()
        .isEmpty()
        .toLowerCase()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .bail(),
    check('password')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Must have a password')
        .bail()
        .custom(value => {
            const regExpassword = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/

            if (!regExpassword.test(value)) {
              throw new Error('Password is not valid. Must have 1 Uper case, 3 lower case, 2 numbers, and 1 special character. Min length 8 char')
            }
            // Indicates the success of this synchronous custom validator
            return true;
          })
        .bail(),
    check('fullName')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Must have a fullName')
        .bail()
        .toLowerCase()
        .bail()
        .custom(value => {
            const regExName = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s+[a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$/

            if (!regExName.test(value)) {
              throw new Error('Fullname is not valid');
            }
            // Indicates the success of this synchronous custom validator
            return true;
          })
        .bail(),
      check('profileImage')
        .custom(value => {
            if (value) {
              const regExName = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi

              if (!regExName.test(value)) {
                throw new Error('Is not a valid image url');
              } 
            }
            // Indicates the success of this synchronous custom validator
            return true;
          })
        .bail(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]
const findUser = async (email) => {
  var userEmail = await User.findOne({ where: { email } });
  return userEmail
}
const validateUserLogin = [
  check('email')
      .exists()
      .not()
      .isEmpty()
      .toLowerCase()
      .normalizeEmail()
      .isEmail()
      .withMessage('Must be a valid email')
      .bail()
      .custom( async (value) => {
        console.log('entre al custom validate', value)
        // const userEmail = await User.findOne({ where: { email: value } });
        const userEmail = await findUser(value)
        console.log(userEmail)
        if (!userEmail) throw new Error("Email no encontrado!");
      }),
  check('password')
      .exists()
      .not()
      .isEmpty()
      .withMessage('Must have a password')
      .bail()
      .custom(value => {
          const validatePassword = bcrypt.compare(value, userEmail.password)
          if (!validatePassword) throw new Error('Invalid Password')
          // Indicates the success of this synchronous custom validator
          return true;
        })
      .bail(),
      (req,res,next)=>{
        validateResult(req,res,next)
    }
]
module.exports = {validateUserCreate, validateUserLogin}

// RegEx Explanation
// ^                         Start anchor
// (?=.*[A-Z].*[A-Z])        Ensure string has two uppercase letters.
// (?=.*[!@#$&*])            Ensure string has one special case letter.
// (?=.*[0-9].*[0-9])        Ensure string has two digits.
// (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
// .{8}                      Ensure string is of length 8.
// $                         End anchor.

// You can use the following regular expression in JavaScript to match a Spanish name with a space:
// /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s+[a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$/
// This expression will match a string that contains alphabetic characters, as well as the ñ and Ñ characters, and is separated by at least one space.

// Asking how to make the last name optional in the comments:
// ^([a-zA-Z'-.]+(?: [a-zA-Z'-.]+)?)$
// This groups the space and the last name together, the ? at the end of this non-capture group makes it optional. Not latin characters

// string = string.replaceAll("[^-_/.,\\p{L}0-9 ]+","");
// The \p{L} matches all Unicode letters regardless of modifiers passed to the regex compile.

//image URL
// /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi

// All are 'non-capturing' regular expressions.

// General format of a URL in a RegEx:
// (?:(?:https?|ftp):\/\/)?(?:www\.)?[^/\r\n]+(?:/[^\r\n]*)?

// // To enforce the protocol
// (?:https?|ftp):\/\/(?:www\.)?[^/\r\n]+

// // To enforce the protocol and trailing slash
// (?:https?|ftp):\/\/(?:www\.)?[^/\r\n]+(?:/[^\r\n]*)

// // To enforce file extensions like .html or .png:
// (?:(?:https?|ftp):\/\/)?(?:www\.)?[^/\r\n]+(?:/[^\r\n]*)(?:[a-zA-Z0-9]+.(?:html|png|webp|js))

// // To implement in GO (https://go.dev), add an extra backslash (' \ ') to every unescaped backslash (' \ ')

// // For the first format, that is:
// (?:(?:https?|ftp):\\/\\/)?(?:www\\.)?[^/\r\n]+(?:/[^\r\n]*)?

// You do not need to add the extra backslash to the '\r' and '\n' because it is handled natively