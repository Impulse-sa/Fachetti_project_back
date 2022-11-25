const { Publication } = require("../db");
const { v4: uuidv4 } = require("uuid");

const getImportantPublications = async () => {
  const results = [];
  try {
    const publications = await Publication.findAll({
      where: {
        isBanned: false,
        isImportant: true,
      },
    });

    publications.forEach((p) => {
      results.push({
        id: p.id,
        title: p.title,
        description: p.description,
        isBanned: p.isBanned,
        isImportant: p.isImportant,
        image: p.image,
      });
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllPublicationsAndBanned = async () => {
  const results = [];
  try {
    const publications = await Publication.findAll({
      order: [["createdAt", "DESC"]],
    });

    publications.forEach((p) => {
      results.push({
        id: p.id,
        title: p.title,
        description: p.description,
        isBanned: p.isBanned,
        isImportant: p.isImportant,
        image: p.image,
      });
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllPublications = async () => {
  const results = [];
  try {
    const publications = await Publication.findAll({
      where: {
        isBanned: false,
      },
      order: [["createdAt", "DESC"]],
    });

    publications.forEach((p) => {
      results.push({
        id: p.id,
        title: p.title,
        description: p.description,
        isBanned: p.isBanned,
        isImportant: p.isImportant,
        image: p.image,
      });
    });

    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createPublication = async (title, description, image, image_id) => {
  try {
    const publicationCreated = await Publication.create({
      id: uuidv4(),
      title,
      description,
      image,
      image_id,
    });

    return publicationCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPublicationById = async (id) => {
  try {
    const publication = await Publication.findByPk(id);

    const result = {
      id: publication.id,
      title: publication.title,
      description: publication.description,
      isBanned: publication.isBanned,
      isImportant: publication.isImportant,
      image: publication.image,
    };
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setBanned = async (id, banned) => {
  try {
    const publictionUpdated = await Publication.update(
      { isBanned: banned },
      {
        where: {
          id,
        },
      }
    );
    if (publictionUpdated) {
      const publication = await getPublicationById(id);
      return publication;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const setImportant = async (id, important) => {
  try {
    const publictionUpdated = await Publication.update(
      { isImportant: important },
      {
        where: {
          id,
        },
      }
    );
    if (publictionUpdated) {
      const publication = await getPublicationById(id);
      return publication;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatePublication = async (id, data) => {
  try {
    const publictionUpdated = await Publication.update(data, {
      where: {
        id,
      },
    });
    if (publictionUpdated) {
      const publication = await getPublicationById(id);
      return publication;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createPublication,
  getAllPublications,
  getAllPublicationsAndBanned,
  getPublicationById,
  setBanned,
  setImportant,
  getImportantPublications,
  updatePublication,
};
