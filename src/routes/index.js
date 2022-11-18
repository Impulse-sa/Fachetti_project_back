const { Router } = require("express");
const router = Router();

const userRouter = require("./users");
const categoryRouter = require("./categories");

router.use("/users", userRouter);
router.use("/categories", categoryRouter);

module.exports = router;
