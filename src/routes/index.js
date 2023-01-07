const { Router } = require("express");
const router = Router();

const roleRouter = require("./roles")
const userRouter = require("./users");
const categoryRouter = require("./categories");
const productRouter = require("./products");
const publicationRouter = require("./publications");
const questionRouter = require("./questions");
const reviewRouter = require("./reviews");
const imageRouter = require("./images");
const authRole = require("../config/authRole");

router.use("/roles", roleRouter);
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/publications", publicationRouter);
router.use("/questions", questionRouter);
router.use("/reviews", authRole(['globalAdmin']), reviewRouter);
router.use("/images", authRole(['globalAdmin']), imageRouter);

module.exports = router;
