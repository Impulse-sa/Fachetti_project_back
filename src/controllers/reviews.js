const { Review } = require("../db");
const { v4: uuidv4 } = require("uuid");

const getAllReviewsAndBanned = async () => {
  const results = [];
  try {
    const reviews = await Review.findAll();

    reviews.forEach((r) => {
      results.push({
        id: r.id,
        title: r.title,
        description: r.description,
        user: r.user,
        isBanned: r.isBanned,
      });
    });

    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllReviews = async () => {
  const results = [];
  try {
    const reviews = await Review.findAll({
      where: {
        isBanned: false,
      },
    });

    reviews.forEach((r) => {
      results.push({
        id: r.id,
        title: r.title,
        description: r.description,
        user: r.user,
        isBanned: r.isBanned,
      });
    });

    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createReview = async (title, description, user) => {
  try {
    const reviewCreated = await Review.create({
      id: uuidv4(),
      user,
      title,
      description,
    });

    return reviewCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getReviewById = async (id) => {
  try {
    const review = await Review.findByPk(id);
    if (!review) return null;

    const result = {
      id: review.id,
      title: review.title,
      description: review.description,
      user: review.user,
      isBanned: review.isBanned,
    };

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setBanned = async (id, banned) => {
  try {
    const reviewUpdated = await Review.update(
      {
        isBanned: banned,
      },
      {
        where: {
          id,
        },
      }
    );

    if (reviewUpdated) {
      const review = await getReviewById(id);
      return review;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createReview,
  getAllReviews,
  setBanned,
  getAllReviewsAndBanned,
};
