const { Image } = require("../db");

const { v4: uuidv4 } = require("uuid");

const { Op } = require("sequelize");

const getAllImages = async () => {
  const results = [];

  try {
    const images = await Image.findAll();

    if (!images) return null;

    images.forEach((i) => {
      results.push({
        id: i.id,
        image_url: i.image_url,
        isLanding: i.isLanding,
      });
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createImage = async (image_url, image_id) => {
  try {
    const imageCreated = await Image.create({
      id: uuidv4(),
      image_url,
      image_id,
    });

    return imageCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getImageById = async (id) => {
  try {
    const image = await Image.findByPk(id);
    if (!image) return null;

    const result = {
      id: image.id,
      image_url: image.image_url,
      isLanding: image.isLanding,
    };
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setLanding = async (id) => {
  try {
    const image = await Image.findByPk(id);
    if (!image) return null;

    const imageUpdated = await Image.update(
      {
        isLanding: true,
      },
      {
        where: {
          id,
        },
      }
    );
    if (imageUpdated) {
      await Image.update(
        {
          isLanding: false,
        },
        {
          where: {
            id: {
              [Op.not]: id,
            },
          },
        }
      );
      const productById = await getImageById(id);
      return productById;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createImage, getAllImages, setLanding, getImageById };
