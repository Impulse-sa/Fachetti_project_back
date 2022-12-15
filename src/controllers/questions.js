const { Question } = require("../db");
const { v4: uuidv4 } = require("uuid");

const getAllQuestions = async () => {
  const results = [];
  try {
    const questions = await Question.findAll();

    questions.forEach((q) => {
      results.push({
        id: q.id,
        username: q.username,
        email: q.email,
        description: q.description,
        isRead: q.isRead,
        isAnswered: q.isAnswered,
      });
    });

    return questions;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllQuestionsAnswered = async () => {
  const results = [];
  try {
    const questions = await Question.findAll({
      where: {
        isAnswered: true,
      },
    });

    questions.forEach((q) => {
      results.push({
        id: q.id,
        username: q.username,
        email: q.email,
        description: q.description,
        isRead: q.isRead,
        isAnswered: q.isAnswered,
      });
    });

    return questions;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllQuestionsNotAnswered = async () => {
  const results = [];
  try {
    const questions = await Question.findAll({
      where: {
        isAnswered: false,
      },
    });

    questions.forEach((q) => {
      results.push({
        id: q.id,
        username: q.username,
        email: q.email,
        description: q.description,
        isRead: q.isRead,
        isAnswered: q.isAnswered,
      });
    });

    return questions;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createQuestion = async (username, email, description,phone) => {
  try {
    const questionCreated = await Question.create({
      id: uuidv4(),
      username,
      email,
      description,
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
      description: question.description,
      username: question.username,
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

module.exports = {
  createQuestion,
  getAllQuestions,
  getAllQuestionsAnswered,
  getAllQuestionsNotAnswered,
  setAnswered,
  getQuestionById,
};
