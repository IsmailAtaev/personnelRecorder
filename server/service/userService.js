const { model } = require("../database");
const { User, UserInfo } = require("../models/model");
const bcrypt = require("bcrypt");
const ApiError = require("../error/ApiError");
const EmployeesService = require("../service/employeesService");



class UserService {

    async registration(name, pass, login, role) {
        try {
            const candidate = await User.findOne({ where: { login } });
            if (candidate) {
                throw ApiError.badRequest(`Пользователь с логином ${login} уже есть`)
            }
            const hash = await bcrypt.hash(pass, 3);
            const user = await User.create({ name, pass: hash, login, role });
            const resultsUserInfo = await EmployeesService.createProfil("-", "-", user.id)
            return { status: true };
        } catch (exeption) {
            return { status: false, exeption }
        }
    }

    async login(login, pass) {

        const user = await User.findOne({
            where: { login }, include: UserInfo
        });

        if (!user) {
            return ApiError.badRequest("Пользовател с таким логином не найден")
        }

        const res = await bcrypt.compare(pass, user.pass);
        if (!res) {
            return ApiError.badRequest("Неправелный пароль")
        }

        // const { dataValues } = user;
        // const ll = user.get({ plain: true }) 
        // const userString = JSON.stringify(user, null, 2);
        // console.log("dataValues " + userString)

        return user.get({ plain: true })
    }


    async addImpageProfil(userId, fileName) {
        const updateImageDB = await UserInfo.update({ profilImg: fileName }, { where: { userId } })

        if (!updateImageDB) {
            throw ApiError.internal("error update image profil")
        }
        return fileName
    }

    async getUsers() {
        const users = await User.findAll({ where: { role: "USER" } });
        if (!users) {
            return ApiError.badRequest("Do not have users");
        }
        return users
    }




}


module.exports = new UserService();