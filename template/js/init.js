document.addEventListener("DOMContentLoaded", init);
function init() {
    var calendar = new Calendar();
    // calendar에서 사용할 다른 객체의 메소드를 넣는다
    calendar.setType("month");
    calendar.init(Today, {

    });
    setCalendar(calendar);
}
function setCalendar(calendar) {
    calendar.drawCalendar();
    // type에 따라 달력 display속성을 block
    calendar.showCalendar();
    // type에 따라 우상단의 type button 활성화
    setTypeButton(calendar.type, calendar.typeButtons);
    // 달력에 따라 today button 활성화/비활성화
    isToday(calendar);
    // 해당 달력에 포함되어 있는 일정 띄우기
}
