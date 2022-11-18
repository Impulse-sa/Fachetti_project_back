const { Router } = require("express");
const router = Router();

const userRouter = require("./users");

router.use("/users", userRouter);

module.exports = router;
