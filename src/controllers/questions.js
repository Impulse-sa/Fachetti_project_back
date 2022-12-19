const { Question } = require("../db");
const { v4: uuidv4 } = require("uuid");
const { paginate } = require("../utils/paginate");
const { convertDate } = require("../utils/convertDate");

const getAllQuestions = async (page=0,pageSize=10) => {
  const results = [];
  try {
    const {count, rows} = await Question.findAndCountAll({
      order: [["createdAt", "DESC"]],
      ...paginate(page,pageSize)
    });

    rows.forEach((q) => {
      results.push({
        id: q.id,
        name: q.name,
        email: q.email,
        message: q.message,
        isRead: q.isRead,
        isAnswered: q.isAnswered,
        date: convertDate(q.createdAt)
      });
    });

    return [results, count];
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllQuestionsAnswered = async (page=0,pageSize=10) => {
  const results = [];
  try {
    const {count, rows} = await Question.findAndCountAll({
      where: {
        isAnswered: true,
      },
      order: [["createdAt", "DESC"]],
      ...paginate(page,pageSize)
    });

    rows.forEach((q) => {
      results.push({
        id: q.id,
        name: q.name,
        email: q.email,
        message: q.message,
        isRead: q.isRead,
        isAnswered: q.isAnswered,
        date: convertDate(q.createdAt)
      });
    });

    return [results, count];
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllQuestionsNotAnswered = async (page=0,pageSize=10) => {
  const results = [];
  try {
    const {count, rows} = await Question.findAndCountAll({
      where: {
        isAnswered: false,
      },
      order: [["createdAt", "DESC"]],
      ...paginate(page,pageSize)
    });

    rows.forEach((q) => {
      results.push({
        id: q.id,
        name: q.name,
        email: q.email,
        message: q.message,
        isRead: q.isRead,
        isAnswered: q.isAnswered,
        date: convertDate(q.createdAt)
      });
    });

    return [results, count];
  } catch (error) {
    throw new Error(error.message);
  }
};

const createQuestion = async (name, message, email,phone) => {
  try {
    const questionCreated = await Question.create({
      id: uuidv4(),
      name,
      message,
      email,
      phone
    });

    return questionCreated;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getQuestionById = async (id) => {
  try {
    const question = await Question.findByPk(id);

    if (!question) return null;

    const result = {
      id: question.id,
      message: question.message,
      name: question.name,
      isRead: question.isRead,
      isAnswered: question.isAnswered,
      email: question.email,
    };

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setAnswered = async (id, answered) => {
  try {
    const questionUpdated = await Question.update(
      {
        isAnswered: answered,
      },
      {
        where: {
          id,
        },
      }
    );
    if (questionUpdated) {
      const question = await getQuestionById(id);
      return question;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const setReaded = async (id, readed) => {
  try {
    const questionUpdated = await Question.update(
      {
        isRead: readed,
      },
      {
        where: {
          id,
        },
      }
    );
    if (questionUpdated) {
      const question = await getQuestionById(id);
      return question;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getAllQuestionsAnswered,
  getAllQuestionsNotAnswered,
  setAnswered,
  getQuestionById,
  setReaded
};
