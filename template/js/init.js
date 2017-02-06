document.addEventListener("DOMContentLoaded", init);
function init() {
    var calendar = new Calendar();
    calendar.init("month", Utility.Today, { });

    var mini = new MiniCalendar();
    mini.init(Utility.Today, {
        GET_NUMS: calendar.setMonthCalendarBody.bind(calendar),
    });

}
