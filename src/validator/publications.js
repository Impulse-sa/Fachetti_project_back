const {check, query, param, body} = require('express-validator')
const { validateResult, validateName, validateImage, validateDescription } = require('../utils/validateHelper')

const validatePublicationCreate = [
    check('title')
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min:3,max:30}).withMessage((value,{req}) => req.t('publications.validations.length'))
        .custom( value => validateDescription(value, 'title')).withMessage((value,{req}) => req.t('validations.description'))
        .bail(),
    check('isImportant')
        .optional()
        .isBoolean(),
    check('image')
        .exists()
        .not()
        .isEmpty()
        .custom(value => validateImage(value)).withMessage((value,{req}) => req.t('validations.image'))
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
        .isLength().withMessage((value,{req}) => req.t('publications.validations.length_title'))
        .custom( value => validateDescription(value, 'title')).withMessage((value,{req}) => req.t('validations.description'))
        .bail(),
    body('isImportant')
        .optional()
        .isBoolean(),
    body('image')
        .exists()
        .not()
        .isEmpty()
        .custom(value => validateImage(value)).withMessage((value,{req}) => req.t('validations.image'))
        .bail(),
    body('descriptiion')
        .exists()
        .not()
        .isEmpty()
        .isLength({min:30,max:300}).withMessage((value,{req}) => req.t('publications.validations.length'))
        .custom( value => validateDescription(value)).withMessage((value,{req}) => req.t('validations.description'))
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
