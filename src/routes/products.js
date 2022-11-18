const { Router } = require("express");
const router = Router();

const { v4: uuidv4 } = require("uuid");

const { Product, Category } = require("../db");
const productController = require("../controllers/products");

router.get("/banned", async (req, res) => {
  try {
    const products = await productController.getAllProductsAndBanned();
    if (!products.length) {
      return res.status(200).json("No se encontraron productos!");
    }

    return res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/categories/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const products = await productController.getAllProductsByCategory(category);
    if (!products.length)
      return res
        .status(200)
        .json("No se encontraron productos de esa categoría");

    return res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/categories/:category/banned", async (req, res) => {
  const { category } = req.params;
  try {
    const products = await productController.getAllProductsByCategoryAndBanned(
      category
    );
    if (!products.length)
      return res
        .status(200)
        .json("No se encontraron productos de esa categoría");

    return res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productController.getProductById(id);

    if (!product) return res.status(400).json("Producto no encontrado!");

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await productController.getAllProducts();
    if (!products.length) {
      return res.status(200).json("No se encontraron productos!");
    }

    return res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  const { name, categoryId } = req.body;

  if (!name) return res.status(400).json("Falta el nombre del producto!");
  if (!categoryId)
    return res.status(400).json("Falta la categoría del producto!");

  try {
    const productExists = await Product.findOne({ where: { name } });
    if (productExists) return res.status(400).json("El producto ya existe!");

    const productCreated = await productController.createProduct(
      name,
      categoryId
    );

    res.status(201).json(productCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { banned } = req.query;

  try {
    const result = await productController.setBanned(id, banned);
    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
