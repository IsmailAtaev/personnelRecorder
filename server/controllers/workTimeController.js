const axios = require("axios")
const { Task } = require("../models/model")
const moment = require("moment")
const ApiError = require("../error/ApiError")
const EmployeeRegistrationTime = require("../models/model")
const { raw } = require("body-parser")
const { Op } = require("sequelize")



let events = [
    {
        id: 1,
        title: "go to the bad",
        description: "go to the bad",
        date: 1684388272
    },
    {
        id: 2,
        title: "go to the bad",
        description: "go to the bad",
        date: 1652852272
    },
    {
        id: 3,
        title: "go to the bad in Feb",
        description: "go to the bad",
        date: 1612736193
    },
    {
        id: 4,
        title: "go to the bad in Apr",
        description: "go to the bad",
        date: 1618524993
    },
    {
        id: 5,
        title: "Go to english at 6 oclock",
        description: "go to the bad",
        date: 1715887000
    },
    {
        id: 6,
        title: "Go to english at 6 oclock",
        description: "go to the bad",
        date: 1715887070
    },
    {
        id: 7,
        title: "Left in school 9 oclock",
        description: "go to the bad",
        date: 1652765872
    }
]


class WorkTimeController {

    async getEvents(req, res, next) {
        const { startDate, endDate } = req.query
        // console.log(startDate, endDate);

        // надо взять данный меджу startDate-endDate 

        return res.json(events);
    }

    async addEvent(req, res) {

        const { EmployeeRegistrationTimeId, title, description, date } = req.body;
        //const tempDate = moment.unix(date).clone().format('DD-MM-YYYY HH:mm:ss')


        const momentDate = moment.tz(date, 'DD-MM-YYYY HH:mm:ss', 'Asia/Ashgabat');
        const el = momentDate.toDate()
        console.log("--------------------------------------------------------------------")
        console.log(el, " - ", EmployeeRegistrationTimeId, title, description, date)

        const result = await Task.create({ title, description, date: el, EmployeeRegistrationTimeId })


        console.log("--------------------------------------------------------------------")
        //console.log("event ", userId, title, description, date)
        // events.push({
        //     id: events.length + 1,
        //     title,
        //     description,
        //     date
        // });
        return res.json(true);
        //   return res.json(events);
    }


    async updateEvent(req, res) {
        console.log(req.body)
        const { id, title, description, date, EmployeeRegistrationTimeId } = req.body;

        const updateEvent = await Task.update(
            { title, description }, {
            where: {
                id, EmployeeRegistrationTimeId
            }
        })

        if (!updateEvent) {
            return res.json("error db when update task " + title);
        }
        console.log(updateEvent)
        return res.json(updateEvent);
    }

    async removeEvent(req, res) {
        console.log(req.params.id);
        const eventId = req.params.id;
        // events = events.filter(elem => elem.id !== eventId);


        if (eventId.length === 0) {
            return res.json("unknow parametr")
        }

        const removeEvent = await Task.destroy({
            where: { id: eventId }
        })

        console.log("removeEvent ", removeEvent)
        return res.json(removeEvent);
    }

    ////
    async getUserEvents(req, res, next) {
        try {
            console.log("req.body ", req.body)
            // const { userId, date } = req.body
            //const momentDate = moment(date, 'DD-MM-YYYY HH:mm:ss');
            // const startOfDayUTC = momentDate.clone().utc().startOf('day').toISOString();
            //const endOfDayUTC = momentDate.clone().utc().endOf('day').toISOString();

            // const userEventsDB = await Task.findAll({
            //     raw: true,
            //     where: {
            //         userId,
            //         date: { [Op.between]: [startOfDayUTC, endOfDayUTC] }
            //     },
            // })

            const userEventsDB = await EmployeeRegistrationTime.findAll({
                raw: true,
                where: {
                    userId,
                    date: { [Op.between]: [startOfDayUTC, endOfDayUTC] }
                },
                include: [{
                    model: "task",
                    required: true // Включаем только те записи времени работы, для которых есть связанная задача
                }]
            })
            console.log(userEventsDB)
            // if (!userEventsDB) {
            //     throw ApiError.BadRequest("Error database Taks ");
            // }

            /* include: [{
        model: Task,
        required: true // Включаем только те записи времени работы, для которых есть связанная задача
    }] */

            return res.json(true)
        } catch (e) {
            next(ApiError.badRequest(e))
        }


    }

}


module.exports = new WorkTimeController();


// const tempDate = moment.unix(date).clone().format('DD-MM-YYYY')
// const formatDate = moment(date).clone().format('DD-MM-YYYY')
// const wagt = moment(formatDate, "DD-MM-YYYY").toDate()
// const un = moment(prevDate, "DD-MM-YYYY").unix();
// const parsedDate = moment(date).format('DD-MM-YYYY');
// const reParsedDate = moment(parsedDate, 'DD-MM-YYYY')
// const rr = moment(reParsedDate).toDate()
// console.log(rr); // Output: 2024-05-19T00:00:00.000Z
// console.log(typeof reParsedDate.toDate()); // Output: object
// console.log("wagt", reParsedDate); // Output: Date object
//console.log("wagt", reParsedDate.format())

// const prevDate = moment(date).clone().format("DD-MM-YYYY")
// const jsDate = moment(prevDate, "DD-MM-YYYY").toDate()
// const startDate = moment(date).clone().startOf("day").format("DD-MM-YYYY 00:00:01")
// const endDate = moment(date).clone().endOf("day").format("DD-MM-YYYY 23:58:59")
// const startDay = moment(startDate, "DD-MM-YYYY 00:00:01").toDate()
// const endDay = moment(endDate, "DD-MM-YYYY 23:58:59").toDate()
// const s = moment(date).utc().format();
//  const e = moment(date).utc().format();
//  const startDate = moment.utc(moment(s).format("DD-MM-YYYY")).startOf("day").toISOString()
// const endDate = moment.utc(moment(e).format("DD-MM-YYYY")).endOf("day").toISOString()
// console.log(req.body)
// const q = moment(date).clone().format("DD-MM-YYYY 00:00:01")
// const tt = moment(q).toDate()
// console.log(tt, " men ", q)
//  const userEventsDB = await Task.findAll({
//     where: {
//         userId,
//         [Op.and]: [
//             { date: { [Op.gte]: startDay } },
//             { date: { [Op.lte]: endDay } }
//         ]
//     }
// })

