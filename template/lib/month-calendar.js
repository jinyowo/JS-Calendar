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
}
var _today = new Date();
var Today = {
    year : _today.getFullYear(),
    month : _today.getMonth(),
    date : _today.getDate(),
}
var calendarType = {
    month : document.querySelector(".fc-month-view"),
    week : document.querySelector(".fc-basicWeek-view"),
    day : document.querySelector(".fc-agendaDay-view"),
}

document.addEventListener("DOMContentLoaded", init);
function init() {
    setMyDate(Today.year, Today.month, Today.date);
    setCalendar(MyDate.type);   // 기본 type "month"

    registerButtonEvents();
}
function setCalendar(type) {
    switch(type) {
        case "month": drawMonthCalendar(); break;
        case "week": drawWeekCalendar(); break;
        case "day": drawDayCalendar(); break;
    }
    showCalendar(type);
    setTypeButton(type);
    setEvent("2017-01-24");//임시 데이터
    isToday();
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
    // 해당 년, 월의 1일 구하기
    var firstDate = new Date(MyDate.year, MyDate.month, 1); // 이번달 1일

    var lastDate = getLastDate(MyDate.month);
    var firstWeekday = firstDate.getDay();

    // 상단 가운데 월이름, 년도 -TODO: 나중에 함수로 뺄 예정
    var monthTitle = document.querySelector(".fc-center");
    var thisMonthFullname = monthArray[MyDate.month];
    monthTitle.innerHTML = "<h2>"+thisMonthFullname+" "+MyDate.year+"</h2>";

    // 달력에 숫자 뿌리기 - TODO: 함수로 빼기
    var calendar = [];

    var prevMonthLastDate = getLastDate(MyDate.month-1);
    var cells = document.querySelectorAll(".fc-month-view .fc-day-top");

    var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;
    var currentDate = 0;

    // 지난달에 해당하는 날짜를 먼저 배열에 넣어준다.
    for(var i = prevMonthfirstDate; i<=prevMonthLastDate; i++) {
        cells[currentDate].setAttribute("data-date", formDate(MyDate.year, MyDate.month, i));
        if(!cells[currentDate].className.includes("fc-other-month")) {
          cells[currentDate].className += " fc-other-month";
        }
        currentDate++;
        calendar.push(i);
    }
    // 이번달에 해당하는 날짜를 추가로 배열에 넣어준다.
    for(var i = 1; i<=lastDate; i++) {
        cells[currentDate].setAttribute("data-date", formDate(MyDate.year, MyDate.month + 1, i));
        if(cells[currentDate].className.includes("fc-other-month")) {
            removeClass(cells[currentDate], "fc-other-month");
        }
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
            if(!cells[currentDate].className.includes("fc-other-month")) {
                cells[currentDate].className += " fc-other-month";
            }
            currentDate++;
            calendar[i] = nextMonthDate++;
        }
        nums[i].innerText = calendar[i];
    }
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
