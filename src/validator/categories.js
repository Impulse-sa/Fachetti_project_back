const {check, query, param, body} = require('express-validator')
const { validateResult, validateName, validateImage } = require('../utils/validateHelper')

const validateCategoryCreate = [
     body('name')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min: 3, max: 30}).withMessage((value,{req}) => req.t('categories.validations.length'))
        .custom( value => validateName(value)).withMessage((value,{req}) => req.t('validations.name'))
        .bail(),
    body('image')
        .exists()
        .not()
        .isEmpty(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }

]

const validateCategoryUpdate = [
    param('id')
        .exists()
        .not()
        .isEmpty()
        .isUUID(),
    body('name')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min: 3, max: 30}).withMessage((value,{req}) => req.t('categories.validations.length'))
        .custom(value => validateName(value)).withMessage((value,{req}) => req.t('validations.name')),
    body('image')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .custom( value => validateImage(value)).withMessage((value,{req}) => req.t('validations.image')),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]

const validateCategoryBanned = [
    param('id')
        .exists()
        .not()
        .isEmpty()
        .isUUID(),
    query('banned')
        .exists()
        .not()
        .isEmpty()
        .isBoolean(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]

module.exports = {
    validateCategoryCreate,
    validateCategoryUpdate,
    validateCategoryBanned
}
