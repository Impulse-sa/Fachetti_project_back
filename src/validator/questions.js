const {body, param, query} = require('express-validator')
const { validateResult, validateImage, validateName, validatePassword } = require('../utils/validateHelper')

const { v4 } = require('uuid');

const validateQuestionCreate = [
    body('name')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Must have a name')
        .bail()
        .custom(value => validateName(value))
        .bail(),
    body('email')
        .exists()
        .not()
        .isEmpty()
        .toLowerCase()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .bail(),
    body('message')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .custom( value => validateName(value,'message'))
        .bail(),
    body('phone')
        .optional()
        .isString()
        .isMobilePhone()
        .bail(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]

const validateQuestionUpdate = [
    param('id')
        .exists()
        .not()
        .isEmpty()
        .isUUID(v4)
        .bail(),
    query('answered')
        .optional()
        .isBoolean()
        .bail(),
    query('readed')
        .optional()
        .isBoolean()
        .bail(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]
module.exports = {
    validateQuestionCreate,
    validateQuestionUpdate
}