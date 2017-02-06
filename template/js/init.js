document.addEventListener("DOMContentLoaded", init);
function init() {
    var calendar = new Calendar();
    var mini = new MiniCalendar();
    calendar.init("month", Utility.Today, {
        SET_MINI: mini.drawCalendar.bind(mini),
    });
    mini.init(Utility.Today, {
        GET_NUMS: calendar.setMonthCalendarBody.bind(calendar),
    });

}
