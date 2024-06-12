const moment = require("moment")
const ApiError = require("../error/ApiError")
const { Holiday } = require("../models/model")
const { Op } = require("sequelize")




class HolidayService {
    async addHoliday(title, date, color) {
        const resultHolidayDB = await Holiday.create({
            title, date, color
        })

        if (!resultHolidayDB) {
            throw ApiError.internal("Can not create databese holiday chech your request")
        }
        return resultHolidayDB
    }

    async getHolidayOneMonth() {
        const startDayOfMonth = moment().clone().startOf('month').startOf('day').format("YYYY-MM-DD");
        const endDayOfMonth = moment().clone().endOf('month').endOf('day').format("YYYY-MM-DD");

        const startDay = moment(startDayOfMonth).toDate()
        const endDay = moment(endDayOfMonth).toDate()

        const holidaysDB = await Holiday.findAll({
            raw: true,
            where: {
                date: {
                    [Op.between]: [startDay, endDay]
                }
            }
        })

        if (!holidaysDB) {
            throw ApiError.internal("Can not create databese holiday chech your request")
        }
        return holidaysDB
    }

    async getHolidayDate(date) {
        const startDayOfMonth = moment(date, "YYYY-MM-DD").clone().startOf('month').startOf('day').format("YYYY-MM-DD");
        const endDayOfMonth = moment(date, "YYYY-MM-DD").clone().endOf('month').endOf('day').format("YYYY-MM-DD");

        const startDay = moment(startDayOfMonth).toDate()
        const endDay = moment(endDayOfMonth).toDate()

        const holidaysDB = await Holiday.findAll({
            raw: true,
            where: {
                date: {
                    [Op.between]: [startDay, endDay]
                }
            }
        })

        if (!holidaysDB) {
            throw ApiError.internal("Can not create databese holiday chech your request")
        }
        return holidaysDB
    }

}




module.exports = new HolidayService()