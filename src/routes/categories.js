const { Router } = require("express");
const router = Router();

const { Category } = require("../db");
const categoryController = require("../controllers/categories");
const {validateCategoryCreate, validateCategoryUpdate, validateCategoryBanned} = require('../validator/categories')

const auth = require('../config/auth')

router.get("/", async (req, res) => {
  try {
    const categories = await categoryController.getAllCategories();

    if (!categories.length) {
      return res.status(200).json("No se encontraron categorías!");
    }

    return res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/banned", auth, async (req, res) => {
  try {
    const categories = await categoryController.getAllCategoriesAndBanned();

    if (!categories.length) {
      return res.status(200).json("No se encontraron categorías!");
    }

    return res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error.message);
  }
});
router.post("/", auth, validateCategoryCreate, async (req, res) => {
    const { name, image } = req.body;

    try {
      const categoryExist = await Category.findOne({ where: { name } });
      if (categoryExist) return res.status(400).json("La categoría ya existe");

      const categoryCreated = await categoryController.createCategory(
        name,
        image
      );
      res.status(201).json(categoryCreated);
    } catch (error) {
      console.log(error.message)
      res.status(400).json(error.message);
    }
  }
);

router.put("/:id", auth, validateCategoryUpdate, async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    const result = await categoryController.updateCategory(id, banned);
    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/:id", auth, validateCategoryBanned, async (req, res) => {
  const { id } = req.params;
  const { banned } = req.query;

  try {
    const result = await categoryController.setBanned(id, banned);
    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
