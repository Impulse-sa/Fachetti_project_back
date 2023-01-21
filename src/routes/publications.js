const { Router } = require("express");
const router = Router();

const publicationController = require("../controllers/publications");
const {validatePublicationCreate, validatePublicationUpdate} = require('../validator/publications')

const auth = require('../config/auth')
const authRole = require('../config/authRole')

router.get("/", async (req, res) => {
  try {
    const publications = await publicationController.getAllPublications();
    if (!publications.length)
      return res.status(200).json(req.t('publications.not_found'));

    res.status(200).json(publications);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/banned", auth, async (req, res) => {
  try {
    const publications =
      await publicationController.getAllPublicationsAndBanned();
    if (!publications.length)
      return res.status(200).json(req.t('publications.not_found'));

    res.status(200).json(publications);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/important", async (req, res) => {
  try {
    const publications = await publicationController.getImportantPublications();
    if (!publications.length)
      return res.status(200).json(req.t('publications.not_found_of_important'));

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
      return res.status(404).json(req.t('publications.not_found_only'));
    res.status(200).json(publication);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", auth, validatePublicationCreate, async (req, res) => {
    const { title, image } = req.body;

    try {
      
        const publicationCreated = await publicationController.createPublication(
            title,
            image
          );
        res.status(201).json(publicationCreated);
        
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
);

router.put("/:id", auth, validatePublicationUpdate, async (req, res) => {
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

router.put("/banned/:id", auth, async (req, res) => {
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

router.delete("/:id", authRole(['globalAdmin']), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await publicationController.deletePublication(id);
    if (result) return res.status(200).json(req.t('publications.deleted'));
    res.status(304).json(req.t('publications.not_deleted'))
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
