const Router = require('express')
const router = new Router()
const HolidaysController = require('../controllers/holidaysController')

router.post('/create', HolidaysController.create)
router.get('/get-holidays', HolidaysController.getHolidays)
router.get('/get/:id', HolidaysController.getHolidaysForDate)



module.exports = router







