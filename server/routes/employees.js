const Router = require("express");
const router = new Router();
const employeesController = require("../controllers/employeesController");

router.get("/test", employeesController.getUser);
router.post("/add", employeesController.addProfil);



module.exports = router;