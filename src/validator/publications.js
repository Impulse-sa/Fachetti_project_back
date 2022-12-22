const {check} = require('express-validator')
const { validateResult } = require('../utils/validateHelper')

const validatePublicationCreate = [
    check('title')
        .exists()
        .not()
        .isEmpty(),
    check('isImportant')
        .exists()
        .isBoolean(),
    check('image')
        .exists()
        .not()
        .isEmpty(),
    (req,res,next)=>{
        validateResult(req,res,next)
    }

]

module.exports = {validatePublicationCreate}