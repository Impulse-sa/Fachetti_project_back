const {check, query, param, body} = require('express-validator')
const { validateResult, validateName, validateImage } = require('../utils/validateHelper')

const validateProductCreate = [
    check('name')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min: 3, max: 30}).withMessage('Min characters: 3, Max characters: 30')
        .custom( value => validateName(value))
        .bail(),
    check('image')
        .exists()
        .not()
        .isEmpty()
        .custom(value => validateImage(value))
        .bail(),
    check('description')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .custom( value => validateName(value,'description'))
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
        .custom( value => validateName(value))
        .bail(),
    body('image')
        .exists()
        .not()
        .isEmpty()
        .custom( value => validateImage(value))
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
