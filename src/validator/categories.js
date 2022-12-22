const {check} = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validateCategoryCreate = [
    check('name')
        .exists()
        .not()
        .isEmpty()
        .isEmail().withMessage((req)=>{
            return req.t('category')
        }),
    check('image')
        .exists()
        .not()
        .isEmpty(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }

]

module.exports = {validateCategoryCreate}