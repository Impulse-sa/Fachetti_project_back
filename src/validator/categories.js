const {check, query, param, body} = require('express-validator')
const { validateResult, validateName, validateImage } = require('../utils/validateHelper')

const validateCategoryCreate = [
    body('name')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min: 3, max: 30}).withMessage('Min characters: 3, Max characters: 30')
        .custom( value => validateName(value))
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
        .isBoolean()
        .custom(value => validateName(value,'name')),
    body('image')
        .exists()
        .not()
        .isEmpty()
        .isBoolean()
        .custom( value => validateImage(value)),
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
    validateCategoryCreate,
    validateCategoryUpdate,
    validateCategoryBanned
}
