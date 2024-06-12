const axios = require("axios");
const EmployeesService = require("../service/employeesService");



class employeesController {
    async getUser(req, res) {
        return res.json({ user: "ismayyl" })
    }

    async addProfil(req, res) {

        const { profilImg, languages, userId } = req.body;
        console.log("info: ", profilImg, languages, userId);
        const result = EmployeesService.createProfil(profilImg, languages, userId);
        console.log("worker " + result)
        return res.json("worker");
    }

}

module.exports = new employeesController();