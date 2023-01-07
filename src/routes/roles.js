const { Router } = require("express");
const router = Router();
const { Role } = require("../db");


const roleControllers = require('../controllers/roles')

router.post('/', async (req,res)=>{
    const {name, description} = req.body

    try {
        const nameExist = await Role.findOne({
            where: {
              name,
            },
          });
      
          if (nameExist) {
            return res.status(400).json("Ya existe un rol con ese nombre");
          }

        const role = await roleControllers.createRole(name, description)
        res.status(201).json(role)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/', async (req,res)=>{
    
    try {
        const roles = await roleControllers.getAllRoles()
        res.status(201).json(roles)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params

    try {
        const role = await roleControllers.getRole(id)
        res.status(201).json(role)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.put('/:id', async (req,res)=>{
    const {id} = req.params
    const {isBanned} = req.query

    try {
        const role = await roleControllers.bannedRole(id,isBanned)
        res.status(201).json(role)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.put('/:id', async (req,res)=>{
    const {id} = req.params
    const {name, description} = req.body
    
    try {
        const role = await roleControllers.updateRole(id, name, description)
        res.status(201).json(role)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router