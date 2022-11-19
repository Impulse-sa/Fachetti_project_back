const { Router } = require("express");
const router = Router();

const userRouter = require("./users");
const categoryRouter = require("./categories");
const productRouter = require("./products");
const publicationRouter = require("./publications");

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/publications", publicationRouter);

module.exports = router;
