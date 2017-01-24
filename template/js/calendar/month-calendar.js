// 월에 맞도록 달력에 숫자를 뿌리는 함수
function drawMonthCalendar() {
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
            addClass(cells[currentDate], "fc-other-month");
        }
        currentDate++;
        calendar.push(i);
    }
    // 이번달에 해당하는 날짜를 추가로 배열에 넣어준다.
    for(var i = 1; i<=lastDate; i++) {
        setDataDate(cells[currentDate], cellsBackground[currentDate], MyDate.year, MyDate.month + 1, i);
        if(cells[currentDate].className.includes("fc-other-month")) {
            removeClass(cells[currentDate], "fc-other-month");
        }
        if(cellsBackground[currentDate].getAttribute("data-date") === formDate(Today.year, Today.month + 1, Today.date)) setToday(cellsBackground[currentDate]);
        else if(cellsBackground[currentDate].className.includes("fc-state-highlight")) removeToday(cellsBackground[currentDate]);

        currentDate++;
        calendar.push(i);
    }
    // 지난달, 이번달, 다음달에 해당하는 날짜를 달력에 보여준다.
    for(var i=0; i<nums.length; i++) {
        if(calendar[i] === undefined) {
            setDataDate(cells[currentDate], cellsBackground[currentDate], MyDate.year, MyDate.month + 2, nextMonthDate);
            if(!cells[currentDate].className.includes("fc-other-month")) {
                addClass(cells[currentDate], "fc-other-month");
            }
            currentDate++;
            calendar.push(nextMonthDate++);
        }
        nums[i].innerText = calendar[i];
    }
    setEvent("2017-01-24"); //임시 데이터
}
