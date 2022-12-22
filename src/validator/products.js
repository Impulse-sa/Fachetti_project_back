const {check} = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateProductCreate = [
    check('name')
        .exists()
        .not()
        .isEmpty(),
    check('image')
        .exists()
        .not()
        .isEmpty(),
    check('description')
        .exists()
        .not()
        .isEmpty(),
    check('categoryId')
        .exists()
        .not()
        .isEmpty(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }

]

const validateProductUpdate = [
    check('id')
        .exists()
        .not()
        .isEmpty(),
    check('isBanned')
        .exists()
        .isBoolean(),
]

module.exports = {
    validateProductCreate,
    validateProductUpdate
}