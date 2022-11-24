const { Router } = require("express");
const router = Router();

const reviewController = require("../controllers/reviews");

router.get("/banned", async (req, res) => {
  try {
    const reviews = await reviewController.getAllReviewsAndBanned();

    if (!reviews.length) return res.status(200).json("No hay reviews!");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await reviewController.getAllReviews();

    if (!reviews.length) return res.status(200).json("No hay reviews!");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  const { title, user, description } = req.body;

  if (!title) return res.status(400).json("Falta el titulo de la review!");
  if (!user) return res.status(400).json("Falta el usuario de la review!");
  if (!description)
    return res.status(400).json("Falta el contenido de la review!");

  try {
    const review = await reviewController.createReview(
      title,
      user,
      description
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { banned } = req.query;

  try {
    const result = await reviewController.setBanned(id, banned);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
