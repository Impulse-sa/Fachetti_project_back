const { Router } = require("express");
const router = Router();

const userRouter = require("./users");
const categoryRouter = require("./categories");
const productRouter = require("./products");
const publicationRouter = require("./publications");
const questionRouter = require("./questions");
const reviewRouter = require("./reviews");

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/publications", publicationRouter);
router.use("/questions", questionRouter);
router.use("/reviews", reviewRouter);

module.exports = router;
