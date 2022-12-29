const { Router } = require("express");
const router = Router();

const questionController = require("../controllers/questions");
const { sendMail } = require("../utils/emailer");

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
  const { readed, answered, page, sizePage } = req.query;
  try {
    if (answered && !readed) {
      const questions = await questionController.getAllQuestionsAnswered( answered, page, sizePage);
      if (!questions.data.length) return res.status(200).json("No hay consultas!");

      return res.status(200).json(questions);
    }

    if (!answered && readed) {
      const questions = await questionController.getAllQuestionsReaded( readed, page, sizePage);
      if (!questions.data.length) return res.status(200).json("No hay consultas!");

      return res.status(200).json(questions);
    }
    if (readed && answered) {
      const questions = await questionController.getAllQuestionsbyQuery(readed, answered, page, sizePage);
      if (!questions.data.length) return res.status(200).json("No hay consultas!");

      return res.status(200).json(questions);
    }

    const questions = await questionController.getAllQuestions(page, sizePage);

    if (!questions.data.length) return res.status(200).json("No hay consultas!");

    res.status(200).json(questions);

  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/", async (req, res) => {
  const { name, message, email, phone } = req.body;

  if (!name) return res.status(400).json("Falta el nombre del usuario!");
  if (!message)
    return res.status(400).json("Falta el contenido de la consulta!");
  if (!email) return res.status(400).json("Falta el email del usuario!");

  try {
    const questionCreated = await questionController.createQuestion(
      name,
      message,
      email,
      phone
    );

    if (questionCreated) sendMail(name, email)
    console.log('ya pase por linea de envio de email')
    res.status(201).json(questionCreated);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/:id", async (req, res) => {
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
    res.status(206).json('Falta indicar parámetro')
  } catch (error) {
    console.log(error)
    res.status(400).json(error.message);
    return
  }
});

module.exports = router;
