const { Router } = require("express");
const router = Router();

const auth = require("../config/auth");
const authRole = require('../config/authRole')

const questionController = require("../controllers/questions");
const { sendMail } = require("../utils/emailer");
const { validateQuestionCreate, validateQuestionUpdate } = require("../validator/questions");

const {htmlTemplateQuestion} = require('../../public/Nueva consulta Fachetti')
const {URL_FRONT} = process.env


router.get("/", auth, async (req, res) => {
  const { readed, answered, page, sizePage } = req.query;
  try {
    if (answered && !readed) {
      const questions = await questionController.getAllQuestionsAnswered( answered, page, sizePage);
      if (!questions.data.length) return res.status(200).json(req.t('questions.not_found'));

      return res.status(200).json(questions);
    }

    if (!answered && readed) {
      const questions = await questionController.getAllQuestionsReaded( readed, page, sizePage);
      if (!questions.data.length) return res.status(200).json(req.t('questions.not_found'));

      return res.status(200).json(questions);
    }
    if (readed && answered) {
      const questions = await questionController.getAllQuestionsbyQuery(readed, answered, page, sizePage);
      if (!questions.data.length) return res.status(200).json(req.t('questions.not_found'));

      return res.status(200).json(questions);
    }

    const questions = await questionController.getAllQuestions(page, sizePage);

    if (!questions.data.length) return res.status(200).json(req.t('questions.not_found'));

    res.status(200).json(questions);

  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const question = await questionController.getQuestionById(id);

    if (!question) return res.status(404).json(req.t('questions.not_found_only'));

    res.status(200).json(question);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", validateQuestionCreate, async (req, res) => {
  const { name, message, email, phone } = req.body;

  try {
    const questionCreated = await questionController.createQuestion(
      name,
      message,
      email,
      phone
    );
    
    const subject = req.t('questions.subject_email')
    if (questionCreated) sendMail( email, subject, name, htmlTemplateQuestion(`${URL_FRONT}/admin/questions`) )
    
    res.status(201).json(questionCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/:id", auth, validateQuestionUpdate, async (req, res) => {
  const { id } = req.params;
  const { answered, readed } = req.query;

  try {
    if (readed) {
      const result = await questionController.setReaded(id, readed);
      res.status(200).json(result);
      return
    }
    if (answered) {
      const result = await questionController.setAnswered(id, answered);
      res.status(200).json(result);
      return
    }
    res.status(206).json(req.t('questions.not_parameter'))
  } catch (error) {
    console.log(error)
    res.status(400).json(error.message);
    return
  }
});

router.delete("/:id", authRole(['globalAdmin']), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await questionController.deleteQuestion(id);
    if (result) return res.status(200).json(req.t('questions.deleted'));
    res.status(304).json(req.t('questions.not_deleted'))
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
