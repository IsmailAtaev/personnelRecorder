const HolidayService = require("../service/holidays")


class HolidaysController {
    async create(req, res) {
        try {
            const { title, date, color } = req.body

            const resultService = HolidayService.addHoliday(title, date, color)
            console.log(resultService)
            return res.json(true)
        } catch (e) {
            return res.json(false)
        }


    }

    async getHolidays(req, res) {
        try {
            const reslut = await HolidayService.getHolidayOneMonth()
            return res.json(reslut)
        } catch (e) {
            return res.json(false)
        }
    }

    async getHolidaysForDate(req, res) {
        try {
            console.log(req.params)

            //const reslut = await HolidayService.getHolidayOneMonth()


            return res.json(req.params)
        } catch (e) {
            return res.json(false)
        }
    }
}

module.exports = new HolidaysController()