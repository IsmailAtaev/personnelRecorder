const { model } = require("../database");


class HelpersWorkTime {

    getBusinessDays(startDate, endDate) {
        let current = startDate.clone();
        let businessDays = [];
        while (current.isSameOrBefore(endDate)) {
            if (current.isoWeekday() !== 6 && current.isoWeekday() !== 7) {
                businessDays.push(current.clone())
            }
            current.add(1, 'days');
        }
        return businessDays
    }


    getNotBusinessDays(startDate, endDate) {
        let current = startDate.clone();
        let notBusinessDays = [];
        while (current.isSameOrBefore(endDate)) {
            if (current.isoWeekday() === 6) {
                notBusinessDays.push(current.clone())
            }
            current.add(1, 'days');
        }
        return notBusinessDays
    }

    async getSumWorkTime(workTimeArray) {

        if (workTimeArray.lenth === 0) {
            return '00:00:00'
        }
        let totalSeconds = 0;

        function timeToSeconds(time) {
            const [hours, minutes, seconds] = time.split(":").map(Number);
            return (hours * 3600) + (minutes * 60) + seconds;
        }

        for (const time of workTimeArray) {
            totalSeconds += timeToSeconds(time);
        }

        const totalHours = Math.floor(totalSeconds / 3600);
        const remainingSecondsAfterHours = totalSeconds % 3600;
        const totalMinutes = Math.floor(remainingSecondsAfterHours / 60);
        const remainingSeconds = remainingSecondsAfterHours % 60;
        return `${totalHours}:${totalMinutes}:${remainingSeconds}`
    }

    
}

module.exports = new HelpersWorkTime()