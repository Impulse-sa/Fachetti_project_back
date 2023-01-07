const { param, body } = require("express-validator");
const { validateName } = require("../utils/validateHelper");

const validateRoleCreate = [
    body('name')
        .optional()
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min: 3, max: 30}).withMessage('Min characters: 3, Max characters: 30')
        .custom( value => validateName(value))
        .bail(),
    body('description')
        .optional()
        .exists()
        .not()
        .isEmpty()
        .isString()
        .custom( value => validateName(value,'description'))
        .bail(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }
]

const validateRoleBanned = [
    param('id')
        .exists()
        .not()
        .isEmpty()
        .isUUID(v4),
    query('isBanned')
        .exists()
        .not()
        .isEmpty()
        .isBoolean(),
    (req,res,next)=>{
      validateResult(req,res,next)
    }
  ]

  const validateRoleUpdated = [
    param('id')
        .exists()
        .not()
        .isEmpty()
        .isUUID(v4),
    body('name')
        .optional()
        .exists()
        .not()
        .isEmpty()
        .isString()
        .isLength({min: 3, max: 10}).withMessage('Min characters: 3, Max characters: 10')
        .custom( value => validateName(value))
        .bail(),
    body('description')
        .optional()
        .exists()
        .not()
        .isEmpty()
        .isString()
        .custom( value => validateName(value,'description'))
        .bail(),
    (req,res,next)=>{
        validateResult(req,res,next)
        }
  ]

  module.exports = {
    validateRoleCreate,
    validateRoleBanned,
    validateRoleUpdated
  }
