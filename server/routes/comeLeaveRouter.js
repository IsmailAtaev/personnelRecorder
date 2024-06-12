const Router = require("express");
const router = new Router();
const ComeLeaveWork = require("../controllers/comeLeaveWork");



router.post("/add", ComeLeaveWork.comeWork);
router.post("/leave", ComeLeaveWork.leaveWork);
router.get("/timesUser/:id", ComeLeaveWork.getUserIdTime);
router.post("/work-time", ComeLeaveWork.getMonthWorkTimeEmploye)
router.put("/update", ComeLeaveWork.updateLeaveTime)





module.exports = router;