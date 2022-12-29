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
        date: convertDate(q.createdAt),
        phone:q.phone
      });
    });

    return [results, +page, +pageSize, count];
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllQuestionsbyQuery = async (isRead=false, isAnswered=false, page=0, pageSize=10) => {
  const results = [];
  try {
    const {count, rows} = await Question.findAndCountAll({
      where: {
        isRead,
        isAnswered
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
        date: convertDate(q.createdAt),
        phone: q.phone
      });
    });

    return [results, +page, +pageSize, count];
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllQuestionsReaded = async ( isRead, page=0,pageSize=10) => {
  const results = [];
  try {
    const {count, rows} = await Question.findAndCountAll({
      where: {
        isRead
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
        date: convertDate(q.createdAt),
        phone: q.phone
      });
    });

    return [results, +page, +pageSize, count];
  } catch (error) {
    throw new Error(error.message);
  }
};
 
const getAllQuestionsAnswered = async ( isAnswered, page=0,pageSize=10) => {
  const results = [];
  try {
    const {count, rows} = await Question.findAndCountAll({
      where: {
        isAnswered
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
        date: convertDate(q.createdAt),
        phone: q.phone
      });
    });

    return [results, +page, +pageSize, count];
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
      phone: question.phone,
      date: convertDate(question.createdAt)
    };

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const setAnswered = async (id, answered) => {
  try {
    const question = await Question.findByPk(id);
    if (question.isRead === false) throw new Error('No se puede responder una consulta que aún no fue vista.')

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
    console.log(error)
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
  getAllQuestionsbyQuery,
  getAllQuestionsReaded,
  getAllQuestionsAnswered,
  setAnswered,
  getQuestionById,
  setReaded
};
