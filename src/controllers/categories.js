const { Category, Product } = require("../db");

const { v4: uuidv4 } = require("uuid");

const getCategoryById = async (id) => {
  try {
    const dbResult = await Category.findByPk(id);

    if (!dbResult) return null;

    const result = {
      id: dbResult.id,
      name: dbResult.name,
      image: dbResult.image,
    };

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllCategories = async () => {
  const results = [];

  try {
    const categories = await Category.findAll({ where: { isBanned: false } });

    categories.forEach((category) => {
      results.push({
        id: category.id,
        name: category.name,
        image: category.image,
      });
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllCategoriesAndBanned = async () => {
  const results = [];

  try {
    const categories = await Category.findAll();

    categories.forEach((category) => {
      results.push({
        id: category.id,
        name: category.name,
        image: category.image,
      });
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCategory = async (name, image, image_id) => {
  try {
    const categoryCreated = await Category.create({
      name,
      id: uuidv4(),
      image,
      image_id,
    });

    return categoryCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setBanned = async (id, banned) => {
  try {
    const categoryUpdated = await Category.update(
      {
        isBanned: banned,
      },
      {
        where: {
          id,
        },
      }
    );
    if (categoryUpdated) {
      await Product.update(
        { isBanned: banned },
        {
          include: Category,
          where: {
            categoryId: id,
          },
        }
      );

      const categoryById = await getCategoryById(id);
      return categoryById;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getAllCategoriesAndBanned,
  setBanned,
  getCategoryById,
};
