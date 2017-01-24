// month이름, weekday이름, 각 달의 마지막 날짜를 저장한 배열
var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekdayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var weekdayClassArray = ["fc-sun", "fc-mon", "fc-tue", "fc-wed", "fc-thu", "fc-fri", "fc-sat"];
// 현재 보여지는 달력의 정보를 저장할 object
var MyDate = {
    year : -1,
    month : -1,
    date : -1,
    type : "month",
};
// 오늘 년, 월, 일 정보를 저장할 object
var _today = new Date();
var Today = {
    year : _today.getFullYear(),
    month : _today.getMonth(),
    date : _today.getDate(),
};
// 달력의 type 3가지를 저장할 object
var calendarType = {
    month : document.querySelector(".fc-month-view"),
    week : document.querySelector(".fc-basicWeek-view"),
    day : document.querySelector(".fc-agendaDay-view"),
};

document.addEventListener("DOMContentLoaded", init);
function init() {
    setMyDate(Today.year, Today.month, Today.date);
    setCalendar(MyDate.type);   // 기본 type "month"

    registerButtonEvents();
}
function setMyDate(year, month, date) {
    MyDate.month = month;
    MyDate.year = year;
    MyDate.date = date;
}
function setCalendar(type) {
    // type에 따라 달력 그리기
    switch(type) {
        case "month": drawMonthCalendar(); break;
        case "week": drawWeekCalendar(); break;
        case "day": drawDayCalendar(); break;
    }
    // type에 따라 달력 display속성을 block
    showCalendar(type);
    // type에 따라 우상단의 type button 활성화
    setTypeButton(type);
    // 달력에 따라 today button 활성화/비활성화
    isToday();
    // 해당 달력에 포함되어 있는 일정 띄우기
}
function getLastDate(month) {
    if(month < 0){ month = 11;}

    var lastDate = new Date(MyDate.year, month+1, 0).getDate();
    return lastDate;
}
function setDataDate(cell, cellBg, year, month, date) {
    cell.setAttribute("data-date", formDate(year, month, date));
    cellBg.setAttribute("data-date", formDate(year, month, date));
}
function setToday(ele) {
    addClass(ele, "fc-today");
    addClass(ele, "fc-state-highlight");
}
function removeToday(ele) {
    removeClass(ele, "fc-today");
    removeClass(ele, "fc-state-highlight");
}
function showCalendar(type) {
    hideAllCalendar();
    switch(type) {
        case "month": calendarType.month.style.display = "block"; break;
        case "week": calendarType.week.style.display = "block"; break;
        case "day": calendarType.day.style.display = "block"; break;
    }
}
function hideAllCalendar() {
    calendarType.month.style.display = "none";
    calendarType.week.style.display = "none";
    calendarType.day.style.display = "none";
}
