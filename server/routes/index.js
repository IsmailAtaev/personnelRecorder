const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const pdfRouter = require("./pdfRouter");
const employees = require("./employees");
const workTimeRouter = require("./workTimeRouter");
const comeLeaveRouter = require("./comeLeaveRouter");
const holidaysRouter = require("./holidaysRouter");


router.use("/user", userRouter);
router.use("/worker", employees);
router.use("/pdf", pdfRouter);

router.use("/workTime", workTimeRouter);

router.use("/time", comeLeaveRouter);
router.use("/holidays", holidaysRouter);








module.exports = router;
