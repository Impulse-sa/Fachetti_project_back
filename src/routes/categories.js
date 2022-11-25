const { Router } = require("express");
const router = Router();

const { Category } = require("../db");
const categoryController = require("../controllers/categories");

const fs = require("fs-extra");
const fileUpload = require("express-fileupload");
const { uploadImage } = require("../utils/cloudinary");

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

router.get("/banned", async (req, res) => {
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

router.post(
  "/",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  async (req, res) => {
    const { name } = req.body;

    if (!name) return res.status(400).json("Falta el nombre de la categoría!");

    try {
      const categoryExist = await Category.findOne({ where: { name } });
      if (categoryExist) return res.status(400).json("La categoría ya existe!");

      if (req.files?.image) {
        const result = await uploadImage(req.files.image.tempFilePath);

        const categoryCreated = await categoryController.createCategory(
          name,
          result.secure_url,
          result.public_id
        );
        await fs.unlink(req.files.image.tempFilePath);
        res.status(201).json(categoryCreated);
      }
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
);

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
