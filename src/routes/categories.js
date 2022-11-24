const { Router } = require("express");
const router = Router();

const { Category } = require("../db");
const categoryController = require("../controllers/categories");

router.get("/", async (req, res) => {
  try {
    const categories = await categoryController.getAllCategories();

    if (!categories.length) {
      return res.status(404).json("No se encontraron categorías!");
    }

    return res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/banned", async (req, res) => {
  try {
    const categories = await categoryController.getAllCategoriesAndBanned();

    if (!categories.length) {
      return res.status(404).json("No se encontraron categorías!");
    }

    return res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json("Falta el nombre de la categoría!");

  try {
    const categoryExist = await Category.findOne({ where: { name } });
    if (categoryExist) return res.status(400).json("La categoría ya existe!");

    const categoryCreated = await categoryController.createCategory(name);

    res.status(201).json(categoryCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/:id", async (req, res) => {
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
