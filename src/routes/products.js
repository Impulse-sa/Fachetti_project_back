const { Router } = require("express");
const router = Router();

const { v4: uuidv4 } = require("uuid");

const { Product, Category } = require("../db");
const productController = require("../controllers/products");
const {validateProductCreate, validateProductUpdate, validateProductBanned} = require('../validator/products')

const auth = require("../config/auth");

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

router.get("/categories/:category/banned", auth, async (req, res) => {
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

    if (!product) return res.status(404).json("Producto no encontrado!");

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

router.post( "/", auth, validateProductCreate, async (req, res) => {
    const { name, description, categoryId, image } = req.body;

    try {
      const productExists = await Product.findOne({ where: { name } });
      if (productExists) return res.status(400).json("El producto ya existe!");

      const productCreated = await productController.createProduct(
        name,
        description,
        image,
        categoryId,
      );

      res.status(201).json(productCreated);
      
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
);

router.put("/:id", auth, validateProductBanned, async (req, res) => {
  const { id } = req.params;
  const { banned } = req.query;

  try {
    const result = await productController.setBanned(id, banned);
    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/edit/:id", auth, validateProductUpdate, async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const productUpdated = await productController.updateProduct(id, data);
    if (productUpdated) res.status(200).json(productUpdated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;

// const { uploadImage } = require("../utils/cloudinary");

// const fs = require("fs-extra");
// const fileUpload = require("express-fileupload");
// router.post(
//   "/",
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "./uploads",
//   }),
//   async (req, res) => {
//     const { name, description, categoryId } = req.body;

//     if (!name) return res.status(400).json("Falta el nombre del producto!");
//     if (!categoryId)
//       return res.status(400).json("Falta la categoría del producto!");
//     if (!description)
//       return res.status(400).json("Falta la descripcion del producto!");

//     try {
//       const productExists = await Product.findOne({ where: { name } });
//       if (productExists) return res.status(400).json("El producto ya existe!");

//       if (req.files?.image) {
//         const result = await uploadImage(req.files.image.tempFilePath);
//         const productCreated = await productController.createProduct(
//           name,
//           description,
//           categoryId,
//           result.secure_url,
//           result.public_id
//         );
//         await fs.unlink(req.files.image.tempFilePath);
//         res.status(201).json(productCreated);
//       } else {
//         const productCreated = await productController.createProduct(
//           name,
//           categoryId,
//           description
//         );
//         res.status(201).json(productCreated);
//       }
//     } catch (error) {
//       res.status(400).json(error.message);
//     }
//   }
// );
