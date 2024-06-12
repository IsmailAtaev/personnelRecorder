// const Router = require("express");
// const router = new Router();
const Router = require("express");
const router = new Router();
const WorkTimeController = require("../controllers/workTimeController");


router.get("/events", WorkTimeController.getEvents)
router.post("/add", WorkTimeController.addEvent)
router.put("/update", WorkTimeController.updateEvent)
router.delete("/remove/:id", WorkTimeController.removeEvent)
router.post("/user/events", WorkTimeController.getUserEvents)




module.exports = router