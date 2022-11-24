const { Router } = require("express");
const router = Router();

const { Question } = require("../db");
const questionController = require("../controllers/questions");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const question = await questionController.getQuestionById(id);

    if (!question) return res.status(404).json("No se encontró la consulta!");

    res.status(200).json(question);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/", async (req, res) => {
  const { answered } = req.query;
  try {
    if (answered === "true") {
      const questions = await questionController.getAllQuestionsAnswered();
      if (!questions.length) return res.status(404).json("No hay consultas!");

      return res.status(200).json(questions);
    }

    if (answered === "false") {
      const questions = await questionController.getAllQuestionsNotAnswered();
      if (!questions.length) return res.status(404).json("No hay consultas!");

      return res.status(200).json(questions);
    }

    const questions = await questionController.getAllQuestions();
    if (!questions.length) return res.status(404).json("No hay consultas!");

    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  const { username, description, email } = req.body;

  if (!username) return res.status(400).json("Falta el nombre del usuario!");
  if (!description)
    return res.status(400).json("Falta el contenido de la consulta!");
  if (!email) return res.status(400).json("Falta el email del usuario!");

  try {
    const questionCreated = await questionController.createQuestion(
      username,
      description,
      email
    );

    res.status(201).json(questionCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { answered } = req.query;

  try {
    const result = await questionController.setAnswered(id, answered);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
