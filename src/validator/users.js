const {check} = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateUserCreate = [
    check('email')
        .exists()
        .not()
        .isEmpty()
        .isEmail().withMessage('Must be a valid email'),
    check('password')
        .exists()
        .not()
        .isEmpty(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }

]

module.exports = {validateUserCreate}