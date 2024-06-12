const axios = require("axios");
const UserService = require("../service/userService");



class userController {

    async registration(req, res, next) {
        try {
            const { name, pass, login, role } = req.body;
            console.log(name, pass, login, role);
            const result = await UserService.registration(name, pass, login, role);
            return res.json(result);
        }
        catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { login, pass } = req.body;
            console.log(login, pass);
            const data = await UserService.login(login, pass);
            return res.json(data);
        } catch (e) {
            next(e);
        }
    }



    async uploadImagProfil(req, res) {
        try {
            const { userId } = req.body;
            const fileName = req.file.filename;
            const result = await UserService.addImpageProfil(userId, fileName)
            return res.json(result)
        } catch (e) {
            return res.json({ status: false })
        }
    }



    async getUsers(req, res, next) {
        try {
            const users = await UserService.getUsers();


            return res.json(users);
        } catch (e) {
            next(e)
        }
    }





}

module.exports = new userController();
