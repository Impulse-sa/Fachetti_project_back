const { Router } = require("express");
const router = Router();
const { Role } = require("../db");

const roleController = require('../controllers/roles');

const authRole = require("../config/authRole");

router.post('/', authRole(['globalAdmin']), async (req,res)=>{
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

        const role = await roleController.createRole(name, description)
        res.status(201).json(role)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/', authRole(['globalAdmin']), async (req,res)=>{
    
    try {
        const roles = await roleController.getAllRoles()
        res.status(201).json(roles)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/:id', authRole(['globalAdmin']), async (req,res)=>{
    const {id} = req.params

    try {
        const role = await roleController.getRole(id)
        res.status(201).json(role)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.put('/:id', authRole(['globalAdmin']), async (req,res)=>{
    const {id} = req.params
    const {isBanned} = req.query

    try {
        const role = await roleController.bannedRole(id,isBanned)
        res.status(201).json(role)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.put('/:id', authRole(['globalAdmin']), async (req,res)=>{
    const {id} = req.params
    const {name, description} = req.body
    
    try {
        const role = await roleController.updateRole(id, name, description)
        res.status(201).json(role)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete("/:id", authRole(['globalAdmin']), async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await roleController.deleteRole(id);
      if (result) return res.status(200).json('Role deleted succesfully');
      res.status(304).json('Role does not deleted')
    } catch (error) {
      res.status(400).json(error.message);
    }
  });
module.exports = router