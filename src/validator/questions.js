const {body, param, query} = require('express-validator')
const { validateResult, validateImage, validateName, validatePassword, validateDescription } = require('../utils/validateHelper')

const validateQuestionCreate = [
    body('name')
        .exists()
        .not()
        .isEmpty()
        .withMessage('Must have a name')
        .bail()
        .isLength({min: 3, max: 30}).withMessage((value,{req}) => req.t('questions.validations.length'))
        .custom( value => validateName(value)).withMessage((value,{req}) => req.t('questions.validations.length'))
        .bail(),
    body('email')
        .exists()
        .not()
        .isEmpty()
        .toLowerCase()
        .normalizeEmail()
        .isEmail()
        .bail(),
    body('message')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .custom( value => validateDescription(value,'message')).withMessage((value,{req}) => req.t('validations.description'))
        .bail(),
    body('phone')
        .optional()
        .isString()
        .custom( value => validateDescription(value,'phone')).withMessage((value,{req}) => req.t('validations.description'))
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
        .isUUID()
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