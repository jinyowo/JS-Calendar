var buttons = document.querySelectorAll(".fc-toolbar button");
var arrowButtons = document.querySelector(".fc-left .fc-button-group");
var typeButtons = document.querySelector(".fc-right .fc-button-group");
var todayButton = document.querySelector(".fc-left .fc-today-button");

var calendarTypeButton = {
    month : document.querySelector(".fc-month-button"),
    week : document.querySelector(".fc-agendaWeek-button"),
    day : document.querySelector(".fc-agendaDay-button"),
};
function registerButtonEvents() {
    // 공통 이벤트
    for(var i=0; i<buttons.length; i++) {
        buttons[i].addEventListener("mouseover", mouseoverEvent);
        buttons[i].addEventListener("mouseout", mouseoutEvent);
        buttons[i].addEventListener("mousedown", mousedownEvent);
        buttons[i].addEventListener("mouseup", mouseupEvent);
    }
    // 화살표 달력 이동
    arrowButtons.addEventListener("click", moveCalendar);
    // 달력 형식 변경
    typeButtons.addEventListener("click", changeType);
    // today
    todayButton.addEventListener("click", returnToday);
}
function moveCalendar(evt) {
    switch(MyDate.type) {
        case "month": moveMonth(evt); break;
        case "week": moveWeek(evt); break;
        case "day": moveDay(evt); break;
    }
    setCalendar(MyDate.type);
}
function moveMonth(evt) {
    var prevArrowClass = "fc-prev-button";
    var nextArrowClass = "fc-next-button";

    var button = evt.target.closest("button");

    if(button.classList.contains(prevArrowClass)) {
        MyDate.month--;
    } else if(button.classList.contains(nextArrowClass)) {
        MyDate.month++;
    }

    if(MyDate.month < 0) { MyDate.month = 11; MyDate.year--;}
    else if(MyDate.month > 11) { MyDate.month = 0; MyDate.year++;}

}
function moveWeek(evt){

}
function moveDay(evt) {

}
function changeType(evt) {
    var button = evt.target.closest("button");
    MyDate.type = button.innerText;
    setCalendar(MyDate.type);
}
function setTypeButton(type) {
    inactiveAllTypeButton();
    switch(type) {
        case "month": calendarTypeButton.month.classList.add("fc-state-active"); break;
        case "week": calendarTypeButton.week.classList.add("fc-state-active"); break;
        case "day": calendarTypeButton.day.classList.add("fc-state-active"); break;
    }
}
function inactiveAllTypeButton() {
    calendarTypeButton.month.classList.remove("fc-state-active");
    calendarTypeButton.week.classList.remove("fc-state-active");
    calendarTypeButton.day.classList.remove("fc-state-active");
}
function isToday() {
    if(MyDate.year !== Today.year || MyDate.month !== Today.month || MyDate.date !== Today.date) {
        activeButton(todayButton);
        return false;
    } else {
        inactiveButton(todayButton);
        return true;
    }
}
function returnToday(evt) {
    if(!isToday()) {
        setMyDate(Today.year, Today.month, Today.date);
        setCalendar(MyDate.type);
    }
}
function mouseoverEvent(evt) {
    var button = evt.target.closest("button");
    button.classList.add("fc-state-hover");
}
function mouseoutEvent(evt) {
    var button = evt.target.closest("button");
    button.classList.remove("fc-state-hover");
}
function mousedownEvent(evt) {
    var button = evt.target.closest("button");
    button.classList.add("fc-state-down");
}
function mouseupEvent(evt) {
    var button = evt.target.closest("button");
    button.classList.remove("fc-state-down");
}

function activeButton(button) {
    button.classList.remove("fc-state-disabled");
}
function inactiveButton(button) {
    button.classList.add("fc-state-disabled");
}
