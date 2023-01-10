const {check, query, param, body} = require('express-validator')
const { validateResult, validateName, validateImage, validateDescription } = require('../utils/validateHelper')

const validatePublicationCreate = [
    check('title')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .custom( value => validateName(value, 'title'))
        .bail(),
    check('isImportant')
        .optional()
        .isBoolean(),
    check('image')
        .exists()
        .not()
        .isEmpty()
        .custom(value => validateImage(value))
        .bail(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]

const validatePublicationUpdate = [
    param('id')
        .exists()
        .not()
        .isEmpty()
        .isUUID(),
    body('title')
        .exists()
        .not()
        .isEmpty()
        .custom( value => validateName(value, 'title'))
        .bail(),
    body('isImportant')
        .optional()
        .isBoolean(),
    body('image')
        .exists()
        .not()
        .isEmpty()
        .custom(value => validateImage(value))
        .bail(),
    body('descriptiion')
        .exists()
        .not()
        .isEmpty()
        .isLength({min:30,max:300})
        .custom( value => validateDescription(value))
        .bail(),
    body('isBanned')
        .exists()
        .not()
        .isEmpty()
        .isBoolean(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]
const validatePublicationBanned = [
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
    validatePublicationCreate,
    validatePublicationBanned,
    validatePublicationUpdate
}
