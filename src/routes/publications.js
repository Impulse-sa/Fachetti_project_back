const { Router } = require("express");
const router = Router();

const { Publication } = require("../db");
const publicationController = require("../controllers/publications");
const { uploadImage } = require("../utils/cloudinary");
const fs = require("fs-extra");
const fileUpload = require("express-fileupload");

router.get("/banned", async (req, res) => {
  try {
    const publications =
      await publicationController.getAllPublicationsAndBanned();
    if (!publications.length)
      return res.status(400).json("No hay publicaciones guardadas!");

    res.status(200).json(publications);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/important", async (req, res) => {
  try {
    const publications = await publicationController.getImportantPublications();
    if (!publications.length)
      return res.status(400).json("No hay publicaciones destacadas!");

    res.status(200).json(publications);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const publication = await publicationController.getPublicationById(id);
    if (!publication)
      return res.status(400).json("No se encontró la publicación!");
    res.status(200).json(publication);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const publications = await publicationController.getAllPublications();
    if (!publications.length)
      return res.status(400).json("No hay publicaciones guardadas!");

    res.status(200).json(publications);
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
    const { title, description } = req.body;

    if (!title)
      return res.status(400).json("Falta el título de la publicación!");
    if (!description)
      return res.status(400).json("Falta la descripción de la publicación!");

    try {
      if (req.files?.image) {
        const result = await uploadImage(req.files.image.tempFilePath);
        const publicationCreated =
          await publicationController.createPublication(
            title,
            description,
            result.secure_url,
            result.public_id
          );
        await fs.unlink(req.files.image.tempFilePath);
        res.status(201).json(publicationCreated);
      } else {
        const publicationCreated =
          await publicationController.createPublication(title, description);

        res.status(201).json(publicationCreated);
      }
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
);

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const publicationUpdated = await publicationController.updatePublication(
      id,
      data
    );
    if (publicationUpdated) res.status(200).json(publicationUpdated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { banned, important } = req.query;

  try {
    if (banned) {
      const result = await publicationController.setBanned(id, banned);
      return res.status(200).json(result);
    }
    if (important) {
      const result = await publicationController.setImportant(id, important);
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
