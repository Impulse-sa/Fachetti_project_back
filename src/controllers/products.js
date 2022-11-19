const { Product, Category } = require("../db");

const { v4: uuidv4 } = require("uuid");

const getProductById = async (id) => {
  try {
    const dbResult = await Product.findByPk(id, {
      include: Category,
    });

    if (!dbResult) return null;

    const result = {
      id: dbResult.id,
      name: dbResult.name,
      image: dbResult.image,
      category: dbResult.category.name,
    };

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllProducts = async () => {
  const results = [];
  try {
    const dbResults = await Product.findAll({
      include: Category,
      where: {
        isBanned: false,
      },
    });

    dbResults.forEach((r) => {
      results.push({
        id: r.id,
        name: r.name,
        image: r.image,
        category: r.category.name,
      });
    });
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllProductsByCategory = async (category) => {
  const results = [];
  try {
    const dbResults = await Product.findAll({
      include: {
        model: Category,
        where: {
          name: category,
        },
      },
      where: {
        isBanned: false,
      },
    });

    dbResults.forEach((r) => {
      results.push({
        id: r.id,
        name: r.name,
        image: r.image,
        category: r.category.name,
      });
    });
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllProductsByCategoryAndBanned = async (category) => {
  const results = [];
  try {
    const dbResults = await Product.findAll({
      include: {
        model: Category,
        where: {
          name: category,
        },
      },
    });

    dbResults.forEach((r) => {
      results.push({
        id: r.id,
        name: r.name,
        image: r.image,
        category: r.category.name,
      });
    });
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllProductsAndBanned = async () => {
  const results = [];
  try {
    const dbResults = await Product.findAll({
      include: Category,
    });

    dbResults.forEach((r) => {
      results.push({
        id: r.id,
        name: r.name,
        image: r.image,
        category: r.category.name,
      });
    });
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createProduct = async (name, categoryId) => {
  try {
    const productCreated = await Product.create({
      name,
      categoryId,
      id: uuidv4(),
    });

    return productCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setBanned = async (id, banned) => {
  try {
    const productUpdated = await Product.update(
      {
        isBanned: banned,
      },
      {
        where: {
          id,
        },
      }
    );
    if (productUpdated) {
      const productById = await getProductById(id);
      return productById;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProduct = async (id, data) => {
  try {
    const productUpdated = await Product.update(data, {
      where: {
        id,
      },
    });
    if (productUpdated) {
      const product = await getProductById(id);
      return product;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getAllProductsAndBanned,
  getProductById,
  setBanned,
  getAllProductsByCategory,
  getAllProductsByCategoryAndBanned,
  updateProduct,
};
