const moment = require('moment')
const ApiError = require("../error/ApiError")
const { EmployeeRegistrationTime, Task } = require("../models/model")
const { Op } = require('sequelize')
const { currentDate, formatDateTime } = require("../helpers/helpers")
const HelpersWorkTime = require('../helpers/helpersWorkTime')
const HolidayService = require('../service/holidays')



class ComeLeaveWork {

    async comeWork(req, res, next) {
        try {
            // moment.updateLocale('tk', { week: { dow: 1 } });

            const { userId, comeStatus } = req.body;
            if (userId === "" || comeStatus === false) {
                throw ApiError.badRequest("User not found")
            }

            // console.log("userId, comeStatus ", userId, comeStatus)
            // const date = moment().clone().format("DD-MM-YYYY hh:mm:ss");
            // const myDate = moment(date, "DD-MM-YYYY hh:mm:ss").toDate();


            const resultDB = await EmployeeRegistrationTime.create({ comeTime: currentDate(), userId })
            if (!resultDB) {
                throw ApiError.BadRequest("error database not added");
            }
            return res.json(true);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async leaveWork(req, res, next) {
        try {
            const { id, leaveStatus } = req.body;
            if (id === "" || leaveStatus === false) {
                throw ApiError.badRequest("User not found")
            }

            // const leftDateTime = moment().clone().format("DD-MM-YYYY hh:mm:ss");
            // const leftWork = moment(leftDateTime, "DD-MM-YYYY hh:mm:ss").toDate();


            const starDay = moment().clone().startOf("day").format("YYYY-MM-DD HH:mm:ssZ");
            const myDate = moment(starDay, "YYYY-MM-DD HH:mm:ssZ").toDate();

            const updateDB = await EmployeeRegistrationTime.update(
                { leaveTime: currentDate() },
                {
                    where: {
                        userId: id,
                        leaveTime: null,
                        comeTime: { [Op.gt]: myDate }
                    }
                }
            )
            // const updateDB = await EmployeeRegistrationTime.findOne({
            //     where: {
            //         userId: id,
            //         comeTime: { [Op.gt]: myDate }
            //     }
            // }
            // )
            //console.log(moment().startOf("day").format("DD-MM-YYYY hh:mm:ss"))
            //console.log(moment(updateDB).format("DD-MM-YYYY hh:mm:ss"))
            //console.log(moment(updateDB.comeTime).clone().format("DD-MM-YYYY hh:mm:ss"))
            return res.json(true)
        } catch (e) {
            next(e);
        }
    }


    async getUserIdTime(req, res, next) {
        try {
            const userId = req.params.id;

            const startDay = moment().clone().startOf('month').startOf('day').format("YYYY-MM-DD HH:mm:ssZ");
            const endDay = moment().clone().endOf('month').endOf('day').format("YYYY-MM-DD HH:mm:ssZ");

            const employeerTime = await EmployeeRegistrationTime.findAll({
                raw: true,
                where: {
                    userId,
                    comeTime: { [Op.gte]: startDay },
                    [Op.or]: [{ leaveTime: { [Op.lte]: endDay } }, { leaveTime: { [Op.eq]: null } }]
                    // leaveTime: { [Op.lte]: endDay }
                },
                include: {
                    model: Task,
                    as: "task",
                    required: false
                }
            });

            if (!employeerTime) {
                throw ApiError.BadRequest("error database not added");
            }


            console.log(employeerTime);
            // const processedResults = employeerTime.map(record => {
            //     return {
            //         id: record.id,
            //         comeTime: moment(record.comeTime).format("YYYY-MM-DD HH:mm:ss"),
            //         leaveTime: record.leaveTime ? moment(record.leaveTime).format("YYYY-MM-DD HH:mm:ss") : null,
            //         flag: record.flag,
            //         userId: record.userId,
            //         task: {
            //             id: record['task.id'],
            //             title: record['task.title'],
            //             description: record['task.description'],
            //             date: record['task.date'] ? moment(record['task.date']).format("YYYY-MM-DD HH:mm:ss") : null,
            //             EmployeeRegistrationTimeId: record['task.EmployeeRegistrationTimeId']
            //         }
            //     };
            // });

            // console.log(processedResults);
            //  console.log(employeerTime.map(el => console.log(el)))
            // const pa = JSON.stringify(employeerTime, null, 2)
            // console.log(pa);
            // const ww = JSON.parse(pa);
            // ww.map(r => console.log(r.task))

            // employeerTime.forEach(time => {
            //     // Accessing data from the EmployeeRegistrationTime model
            //     console.log('EmployeeRegistrationTime ID:', time.id);
            //     console.log('Come Time:', time.comeTime);
            //     console.log('Leave Time:', time.leaveTime);
            //     console.log('Flag:', time.flag);

            //     // Accessing data from the associated Task model, if it exists
            //     if (time.task) {
            //         console.log('Task ID:', time.task.id);
            //         console.log('Task Title:', time.task.title);
            //         console.log('Task Description:', time.task.description);
            //         console.log('Task Date:', time.task.date);
            //     } else {
            //         console.log('No task associated with this EmployeeRegistrationTime record.');
            //     }
            // });

            return res.json(employeerTime);
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }

    async getMonthWorkTimeEmploye(req, res) {
        try {
            const { id, date } = req.body

            if (id === undefined || date === undefined) {
                return res.json(false)
            }

            // Work time one month
            const startOfMonth = moment(date, 'YYYY-MM').startOf('month')
            const endOfMonth = moment(date, 'YYYY-MM').endOf('month')

            const workDays = HelpersWorkTime.getBusinessDays(startOfMonth, endOfMonth)
            const workDaysSaturday = HelpersWorkTime.getNotBusinessDays(startOfMonth, endOfMonth)

            const startDay = moment(date, 'YYYY-MM').clone().startOf('month').startOf('day').format("YYYY-MM-DD HH:mm:ssZ");
            const endDay = moment(date, 'YYYY-MM').clone().endOf('month').endOf('day').format("YYYY-MM-DD HH:mm:ssZ");

            const employeerTime = await EmployeeRegistrationTime.findAll({
                raw: true,
                where: {
                    userId: id,
                    comeTime: { [Op.gte]: startDay },
                    [Op.or]: [{ leaveTime: { [Op.lte]: endDay } }, { leaveTime: { [Op.eq]: null } }]
                }
            })

            // Sum work time HH:MM:SS
            const saturdayWorkCount = workDaysSaturday.length * 4
            const holidaysCount = await HolidayService.getHolidayDate(date)
            const workTimeOfMonth = ((workDays.length - holidaysCount.length) * 8) + saturdayWorkCount;

            const workingTimeMonth = employeerTime.filter(g => g.leaveTime !== null)
            const noWorkDays = employeerTime.filter(g => g.leaveTime === null)

            const timeWorkMonth = workingTimeMonth.map(elem => Math.floor(
                moment.duration(moment(elem.leaveTime).diff(moment(elem.comeTime))).asHours())
                + " : " +
                moment.duration(moment(elem.leaveTime).diff(moment(elem.comeTime))).minutes()
                + " : " +
                moment.duration(moment(elem.leaveTime).diff(moment(elem.comeTime))).seconds()

            )
            const sumWorkTime = await HelpersWorkTime.getSumWorkTime(timeWorkMonth)

            async function sumWorkTimeByDay(data) {
                const filteredData = data.filter(item => item.leaveTime !== null);
                const groupedData = filteredData.reduce((acc, item) => {
                    const date = moment(item.comeTime).format('DD-MM-YYYY');
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(item);
                    return acc;
                }, {});

                const result = await Promise.all(Object.keys(groupedData).map(async date => {
                    const workTimes = groupedData[date].map(item => {
                        const comeTime = moment(item.comeTime);
                        const leaveTime = moment(item.leaveTime);
                        const duration = moment.duration(leaveTime.diff(comeTime));
                        const hours = Math.floor(duration.asHours());
                        const minutes = duration.minutes();
                        const seconds = duration.seconds();
                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    });
                    const totalWorkTime = await HelpersWorkTime.getSumWorkTime(workTimes);
                    return {
                        date,
                        totalWorkTime
                    };
                }));
                return result;
            }

            const temp = await sumWorkTimeByDay(employeerTime);

            return res.json({ workingDaysMonth: temp, employeerTimeWork: sumWorkTime, notWorkingDays: noWorkDays })
        } catch (e) {
            return res.json(e)
        }

    }

    async updateLeaveTime(req, res) {
        try {
            const { id, leaveTime, userId } = req.body


            console.log(id, leaveTime, userId)


            //const dateTimeWithSeconds = leaveTime + ":00";
            //const parsedDate = new Date(dateTimeWithSeconds);


            const parsedDate = formatDateTime(leaveTime) //moment.tz(leaveTime, "YYYY-MM-DD HH:mm", "UTC").local().toDate();
            console.log(formatDateTime(leaveTime));
            console.log(typeof formatDateTime(leaveTime));
            const yesterdayLeftTime = await EmployeeRegistrationTime.update(
                { leaveTime: parsedDate }, { where: { id, userId } }
            )
            console.log(yesterdayLeftTime)

            if (!yesterdayLeftTime) {
                throw ApiError.BadRequest("error database not added");
            }


            return res.json(true)
        } catch (exception) {
            return res.json("Error update left work time")
        }
    }







}

module.exports = new ComeLeaveWork();
//merdan arslan batyr
//nokatKomputer

//console.log("sumWorkTime ", sumWorkTime)
//console.log(holidaysCount.length, workTimeOfMonth)
//console.log(u)
//u.map(f => console.log(f))
// console.log(id, date, startDay, endDay, employeerTime)
// gg.map((t) => {
//     console.log(t.id)
//     console.log(Math.floor(
//         moment.duration(moment(t.leaveTime).diff(moment(t.comeTime))).asHours())
//         + " : " +
//         moment.duration(moment(t.leaveTime).diff(moment(t.comeTime))).minutes()
//         + " : " +
//         moment.duration(moment(t.leaveTime).diff(moment(t.comeTime))).seconds()
//     )
// })
//console.log(gg)
//console.log(nol)
//console.log("1-5 " + workDays.length)
// console.log("6 " + workDaysSaturday.length)