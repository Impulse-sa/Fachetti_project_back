const { Router } = require("express");
const router = Router();
const { Image } = require("../db");
const { uploadImage } = require("../utils/cloudinary");

const fs = require("fs-extra");
const fileUpload = require("express-fileupload");

const imageController = require("../controllers/images");

router.put("/landing/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await imageController.setLanding(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const images = await imageController.getAllImages();

    if (!images.length)
      return res.status(200).json("No hay imagenes guardadas!");

    res.status(200).json(images);
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
    try {
      if (req.files?.image) {
        const result = await uploadImage(req.files.image.tempFilePath,req.body.name);
        const imageCreated = await imageController.createImage(
          result.secure_url,
          result.public_id
        );
        await fs.unlink(req.files.image.tempFilePath);
        return res.status(201).json(imageCreated ? imageCreated : 'no se pudo crear la imagen');
      } else return res.status(400).json('Falta imagen adjunta')

    } catch (error) {
      res.status(400).json(error.message);
    }
  }
);

router.delete('/', async (req,res)=>{
  try {
    
  } catch (error) {
    
  }
})

module.exports = router;
