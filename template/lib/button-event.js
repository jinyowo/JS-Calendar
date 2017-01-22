var buttons = document.querySelectorAll(".fc-toolbar button");
var arrowButtons = document.querySelector(".fc-left .fc-button-group");
var typeButtons = document.querySelector(".fc-right .fc-button-group");
var todayButton = document.querySelector(".fc-left .fc-today-button");

function registerButtonEvents() {
    // 공통 이벤트
    for(var i=0; i<buttons.length; i++) {
        buttons[i].addEventListener("mouseover", mouseoverEvent);
        buttons[i].addEventListener("mouseout", mouseoutEvent);
        buttons[i].addEventListener("mousedown", mousedownEvent);
        buttons[i].addEventListener("mouseup", mouseupEvent);
    }

    // 화살표 달력 이동
    arrowButtons.addEventListener("click", moveMonth);
    // 달력 형식 변경
    typeButtons.addEventListener("click", changeType);
    // today
    todayButton.addEventListener("click", returnToday);
}

function moveMonth(evt) {
    var prevArrowClass = "fc-prev-button";
    var nextArrowClass = "fc-next-button";

    var button = evt.target.closest("button");

    if(button.classList.contains(prevArrowClass)) {
        myDate.month--;
    } else if(button.classList.contains(nextArrowClass)) {
        myDate.month++;
    }

    if(myDate.month < 0) { myDate.month = 11; myDate.year--;}
    else if(myDate.month > 11) { myDate.month = 0; myDate.year++;}

    activeButton(todayButton);
    setCalendar();
}

function changeType(evt) {
    var typeSet = document.querySelectorAll(".fc-right button");
    var calendarSet = document.querySelectorAll(".fc-view-container .fc-view");
    var type = evt.target.closest("button");

    hideCalendar();
    for(var i=0; i<typeSet.length; i++) {
        if(typeSet[i] === type) {
            calendarSet[i].style.display = "block";
            typeSet[i].classList.add("fc-state-active");
        } else {
            typeSet[i].classList.remove("fc-state-active");
        }
    }

}

function returnToday(evt) {
    var today = new Date();
    var thisYear = today.getFullYear();
    var thisMonth = today.getMonth();

    inactiveButton(todayButton);
    setMyDate(thisYear, thisMonth);
    setCalendar();
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
