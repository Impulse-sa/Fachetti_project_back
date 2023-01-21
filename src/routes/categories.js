const { Router } = require("express");
const router = Router();

const { Category } = require("../db");
const categoryController = require("../controllers/categories");
const {validateCategoryCreate, validateCategoryUpdate, validateCategoryBanned} = require('../validator/categories')

const auth = require('../config/auth')
const authRole = require('../config/authRole')

router.get("/", async (req, res) => {
  try {
    categories = await categoryController.getAllCategories();

    if (!categories.length) {
      return res.status(200).json(req.t('categories.not_found'));
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
      return res.status(200).json(req.t('categories.not_found'));
    }
    
    return res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryController.getCategoryById(id);
    console.log(category)
    if (!category) {
      return res.status(200).json(req.t('categories.not_found_only'));
    }

    return res.status(200).json(category);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", auth, validateCategoryCreate, async (req, res) => {
    const { name, image } = req.body;

    try {
      console.log('entre')
      const categoryExist = await Category.findOne({ where: { name } });
      if (categoryExist) return res.status(400).json(req.t('categories.exist'));

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
  const data = req.body;

  try {
    const result = await categoryController.updateCategory(id, data);
    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/banned/:id", auth, validateCategoryBanned, async (req, res) => {
  const { id } = req.params;
  const { banned } = req.query;

  try {
    const result = await categoryController.setBanned(id, banned);
    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.delete("/:id", authRole(['globalAdmin']), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await categoryController.deleteCategory(id);
    if (result) return res.status(200).json(req.t('categories.deleted'));
    res.status(304).json(req.t('categories.not_deleted'))
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
