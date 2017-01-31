document.addEventListener("DOMContentLoaded", init);
function init() {
    var calendar = new Calendar();
    // calendar에서 사용할 다른 객체의 메소드를 넣는다
    calendar.setType("month");
    calendar.init(Today, {

    });
    calendar.setCalendar();
}
