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
      isBanned: dbResult.isBanned
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
        isBanned: category.isBanned
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
        isBanned: category.isBanned
      });
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCategory = async (name, image) => {
  try {
    const categoryCreated = await Category.create({
      name,
      id: uuidv4(),
      image,
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

const updateCategory = async (id, data) => {
  try {
    const categoryUpdated = await Category.update(data, {
      where: {
        id,
      },
    });
    if (categoryUpdated) {
      const category = await getCategoryById(id);
      return category;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCategory = async (id) => {
  try {
    const dbResult = await Category.destroy(
      {
        where: {
          id
        }
      }
    )
    return dbResult
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  createCategory,
  getAllCategories,
  getAllCategoriesAndBanned,
  setBanned,
  getCategoryById,
  deleteCategory,
  updateCategory
};
