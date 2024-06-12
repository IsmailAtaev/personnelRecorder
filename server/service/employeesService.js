const { model } = require("../database");
const { UserInfo } = require("../models/model");
const ApiError = require("../error/ApiError");


class EmployeesService {
    async createProfil(profilImg, languages, userId) {
        try {
            const userInfo = await UserInfo.create({
                profilImg, languages, userId
            });
            console.log("user1 " + userInfo)
            return userInfo;
        } catch (e) {
        
        }
    }

    


}


module.exports = new EmployeesService();