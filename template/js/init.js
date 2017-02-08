$(function init() {
    var calendar = new Calendar();
    var mini = new MiniCalendar();
    var schedules = new ScheduleDisplay();

    calendar.init("month", Utility.Today, schedules, {
        SET_MINI: mini.drawCalendar.bind(mini),
    });
    mini.init(Utility.Today, {
        GET_NUMS: calendar.calculateCalendar.bind(calendar),
        SET_NUMS: calendar.setCalendar.bind(calendar),
        GET_EVENT: schedules.getThisMonthEvent.bind(schedules),
    });

});
