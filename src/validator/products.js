const {check, query, param, body} = require('express-validator')
const { validateResult, validateName, validateImage, validateDescription } = require('../utils/validateHelper')

const validateProductCreate = [
    check('name')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min: 3, max: 30}).withMessage((value,{req}) => req.t('products.validations.length'))
        .custom( value => validateName(value)).withMessage((value,{req}) => req.t('products.validations.length'))
        .bail(),
    check('image')
        .exists()
        .not()
        .isEmpty()
        .custom(value => validateImage(value)).withMessage((value,{req}) => req.t('validations.image'))
        .bail(),
    check('description')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min: 10, max: 200}).withMessage((value,{req}) => req.t('validations.description_length'))
        .custom( value => validateDescription(value)).withMessage((value,{req}) => req.t('validations.description'))
        .bail(),
    check('categoryId')
        .exists()
        .not()
        .isEmpty()
        .isUUID(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]

const validateProductUpdate = [
    param('id')
        .exists()
        .not()
        .isEmpty()
        .isUUID()
        .bail(),
    body('name')
        .exists()
        .not()
        .isEmpty()
        .custom( value => validateName(value)).withMessage((value,{req}) => req.t('validations.name'))
        .bail(),
    body('image')
        .exists()
        .not()
        .isEmpty()
        .custom( value => validateImage(value)).withMessage((value,{req}) => req.t('validations.image'))
        .bail(),
    check('description')
        .optional()
        .isString()
        .custom( value => validateDescription(value)).withMessage((value,{req}) => req.t('validations.description'))
        .bail(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]

const validateProductBanned = [
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
    validateProductCreate,
    validateProductUpdate,
    validateProductBanned

}
