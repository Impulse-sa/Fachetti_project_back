const {body, param, query} = require('express-validator')
const { validateResult, validateImage, validateName, validatePassword, findUser } = require('../utils/validateHelper')
const { v4 } = require('uuid');

const validateUserCreate = [
    body('email')
        .exists()
        .not()
        .isEmpty()
        .toLowerCase()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .bail(),
    body('password')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Must have a password')
        .bail()
        .custom(value => validatePassword(value))
        .bail(),
    body('fullName')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Must have a fullName')
        .bail()
        .custom(value => validateName(value,'fullName'))
        .bail(),
    body('profileImage')
        .optional()
        .custom( value => validateImage(value))
        .bail(),
    body('roleId')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Must have a Role'),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]


const validateUserLogin = [
  body('email')
      .exists()
      .not()
      .isEmpty()
      .toLowerCase()
      .normalizeEmail()
      .isEmail()
      .withMessage('Must be a valid email')
      .bail()
      .custom( async (value) => {
        const userEmail = await findUser(value)
        if (!userEmail) throw new Error("Email no encontrado!");
      }),
  body('password')
      .exists()
      .not()
      .isEmpty()
      .withMessage('Must have a password')
      .bail(),
  (req,res,next)=>{
    validateResult(req,res,next)
    }
]

const validateUserUpdate = [
  param('id')
      .exists()
      .not()
      .isEmpty()
      .isUUID(),
  body('fullName')
      .exists()
      .not()
      .isEmpty()
      .withMessage('Must have a fullName')
      .bail()
      .custom(value => validateName(value,'fullName'))
      .bail(),
  body('profileImage')
      .optional()
      .custom( value => validateImage(value))
      .bail(),
  (req,res,next)=>{
    validateResult(req,res,next)
  }
]

const validateUserBanned = [
  param('id')
      .exists()
      .not()
      .isEmpty()
      .isUUID(),
  query('isBanned')
      .exists()
      .not()
      .isEmpty()
      .isBoolean(),
  (req,res,next)=>{
    validateResult(req,res,next)
  }
]
module.exports = {
  validateUserCreate, 
  validateUserLogin,
  validateUserUpdate,
  validateUserBanned
}

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