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
    cell.setAttribute("data-date", Utility.formDate(year, month, date));
    cellBg.setAttribute("data-date", Utility.formDate(year, month, date));
}
function setToday(ele) {
    Utility.addClass(ele, "fc-today");
    Utility.addClass(ele, "fc-state-highlight");
}
function removeToday(ele) {
    Utility.removeClass(ele, "fc-today");
    Utility.removeClass(ele, "fc-state-highlight");
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
// 월에 맞도록 달력에 숫자를 뿌리는 함수
function drawMonthCalendar() {
    debugger;
    // 상단에 "January 2017" 출력
    setMonthTitle();
    // 달력에 숫자 출력
    setMonthCalendarBody();
}
function setMonthTitle() {
    var monthTitle = document.querySelector(".fc-center");
    var thisMonthFullname = monthArray[MyDate.month];
    monthTitle.innerHTML = "<h2>" + thisMonthFullname + " " + MyDate.year + "</h2>";
}
function setMonthCalendarBody() {
    // 이번달 1일, 마지막날, 1일의 요일 구하기
    var firstDate = new Date(MyDate.year, MyDate.month, 1);
    var lastDate = getLastDate(MyDate.month);
    var firstWeekday = firstDate.getDay();

    var calendar = [];
    var cells = document.querySelectorAll(".fc-month-view .fc-day-top");
    var cellsBackground = document.querySelectorAll(".fc-month-view .fc-day");
    var nums = document.querySelectorAll(".fc-content-skeleton a.fc-day-number");

    var prevMonthLastDate = getLastDate(MyDate.month-1);
    var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;
    var currentDate = 0;
    var nextMonthDate = 1;

    // 지난달에 해당하는 날짜를 먼저 배열에 넣어준다.
    for(var i = prevMonthfirstDate; i<=prevMonthLastDate; i++) {
        setDataDate(cells[currentDate], cellsBackground[currentDate], MyDate.year, MyDate.month, i);
        if(!cells[currentDate].className.includes("fc-other-month")) {
            Utility.addClass(cells[currentDate], "fc-other-month");
        }
        currentDate++;
        calendar.push(i);
    }
    // 이번달에 해당하는 날짜를 추가로 배열에 넣어준다.
    for(var i = 1; i<=lastDate; i++) {
        setDataDate(cells[currentDate], cellsBackground[currentDate], MyDate.year, MyDate.month + 1, i);
        if(cells[currentDate].className.includes("fc-other-month")) {
            Utility.removeClass(cells[currentDate], "fc-other-month");
        }
        if(cellsBackground[currentDate].getAttribute("data-date") === Utility.formDate(Today.year, Today.month + 1, Today.date)) setToday(cellsBackground[currentDate]);
        else if(cellsBackground[currentDate].className.includes("fc-state-highlight")) removeToday(cellsBackground[currentDate]);

        currentDate++;
        calendar.push(i);
    }
    // 지난달, 이번달, 다음달에 해당하는 날짜를 달력에 보여준다.
    for(var i=0; i<nums.length; i++) {
        if(calendar[i] === undefined) {
            setDataDate(cells[currentDate], cellsBackground[currentDate], MyDate.year, MyDate.month + 2, nextMonthDate);
            if(!cells[currentDate].className.includes("fc-other-month")) {
                Utility.addClass(cells[currentDate], "fc-other-month");
            }
            currentDate++;
            calendar.push(nextMonthDate++);
        }
        nums[i].innerText = calendar[i];
    }
    setEvent("2017-01-24"); //임시 데이터
}
