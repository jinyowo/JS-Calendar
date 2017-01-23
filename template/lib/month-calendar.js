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
    setEvent("2017-01-24"); //임시 데이터
}
function setMyDate(year, month, date) {
    MyDate.month = month;
    MyDate.year = year;
    MyDate.date = date;
}
function getLastDate(month) {
    if(month < 0){ month = 11;}

    var lastDate = new Date(MyDate.year, month+1, 0).getDate();
    return lastDate;
}

// 월에 맞도록 달력에 숫자를 뿌리는 함수
function drawMonthCalendar() {
    // 이번달 1일, 마지막날, 1일의 요일 구하기
    var firstDate = new Date(MyDate.year, MyDate.month, 1);
    var lastDate = getLastDate(MyDate.month);
    var firstWeekday = firstDate.getDay();

    // 상단에 "January 2017" 출력
    setMonthTitle();
    // 달력에 숫자 출력
    setDate(firstDate, lastDate, firstWeekday);
}
function setMonthTitle() {
    var monthTitle = document.querySelector(".fc-center");
    var thisMonthFullname = monthArray[MyDate.month];
    monthTitle.innerHTML = "<h2>" + thisMonthFullname + " " + MyDate.year + "</h2>";
}
function setDate(firstDate, lastDate, firstWeekday) {
    var calendar = [];

    var prevMonthLastDate = getLastDate(MyDate.month-1);
    var cells = document.querySelectorAll(".fc-month-view .fc-day-top");
    var cellsBackground = document.querySelectorAll(".fc-month-view .fc-day");

    var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;
    var currentDate = 0;

    // 지난달에 해당하는 날짜를 먼저 배열에 넣어준다.
    for(var i = prevMonthfirstDate; i<=prevMonthLastDate; i++) {
        cells[currentDate].setAttribute("data-date", formDate(MyDate.year, MyDate.month, i));
        cellsBackground[currentDate].setAttribute("data-date", formDate(MyDate.year, MyDate.month, i));
        if(!cells[currentDate].className.includes("fc-other-month")) {
          cells[currentDate].className += " fc-other-month";
        }
        currentDate++;
        calendar.push(i);
    }
    // 이번달에 해당하는 날짜를 추가로 배열에 넣어준다.
    for(var i = 1; i<=lastDate; i++) {
        cells[currentDate].setAttribute("data-date", formDate(MyDate.year, MyDate.month + 1, i));
        cellsBackground[currentDate].setAttribute("data-date", formDate(MyDate.year, MyDate.month + 1, i));
        if(cells[currentDate].className.includes("fc-other-month")) {
            removeClass(cells[currentDate], "fc-other-month");
        }
        if(cellsBackground[currentDate].getAttribute("data-date") === formDate(Today.year, Today.month + 1, Today.date)) setToday(cellsBackground[currentDate]);
        else if(cellsBackground[currentDate].className.includes("fc-state-highlight")) removeToday(cellsBackground[currentDate]);
        currentDate++;

        calendar.push(i);
    }
    // 숫자를 띄울 a태그 전체
    var nums = document.querySelectorAll(".fc-content-skeleton a.fc-day-number");
    var nextMonthDate = 1;
    for(var i=0; i<nums.length; i++) {
        // 다음달 날짜 채우기
        if(calendar[i] === undefined) {
            cells[currentDate].setAttribute("data-date", formDate(MyDate.year, MyDate.month + 2, nextMonthDate));
            cellsBackground[currentDate].setAttribute("data-date", formDate(MyDate.year, MyDate.month + 2, nextMonthDate));
            if(!cells[currentDate].className.includes("fc-other-month")) {
                cells[currentDate].className += " fc-other-month";
            }
            currentDate++;
            calendar[i] = nextMonthDate++;
        }
        nums[i].innerText = calendar[i];
    }
}
function setToday(ele) {
    ele.classList.add("fc-today");
    ele.classList.add("fc-state-highlight");
}
function removeToday(ele) {
    ele.classList.remove("fc-today");
    ele.classList.remove("fc-state-highlight");
}
function drawWeekCalendar() {

}
function drawDayCalendar() {

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
