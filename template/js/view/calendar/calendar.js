function Calendar() {
    this.myDate = {
        year: -1,
        month: -1,
        date: -1,
    };
    this.type = "";
    this.monthTitle = document.querySelector(".fc-center");
    this.cells = document.querySelectorAll(".fc-month-view .fc-day-top");
    this.cellsBackground = document.querySelectorAll(".fc-month-view .fc-day");
    this.nums = document.querySelectorAll(".fc-content-skeleton a.fc-day-number");

    // Button set
    this.arrowButtons = [
        new Button(".fc-prev-button", "arrow"),
        new Button(".fc-next-button", "arrow"),
    ];
    this.typeButtons = [
        new Button(".fc-month-button", "type"),
        new Button(".fc-agendaWeek-button", "type"),
        new Button(".fc-agendaDay-button", "type"),
    ];
    this.todayButton = new Button(".fc-left .fc-today-button", "today");
}

Calendar.prototype = {
    init: function(base, option) {
        this.setMyDate(base);
        this.callbackList = option;
        // Button init
        for (var i = 0; i < this.arrowButtons.length; i++) this.arrowButtons[i].init({});
        for (var i = 0; i < this.typeButtons.length; i++) this.typeButtons[i].init({});
        this.todayButton.init({});
    },
    setType: function(type) {
        this.type = type;
    },
    setMyDate: function(base) {
        this.myDate.month = base.month;
        this.myDate.year = base.year;
        this.myDate.date = base.date;
    },
    setToday: function(ele) {
        Utility.addClass(ele, "fc-today");
        Utility.addClass(ele, "fc-state-highlight");
    },
    removeToday: function(ele) {
        Utility.removeClass(ele, "fc-today");
        Utility.removeClass(ele, "fc-state-highlight");
    },
    // 월에 맞도록 달력에 숫자를 뿌리는 함수
    drawMonthCalendar: function() {
        // 상단에 "January 2017" 출력
        this.setMonthTitle();
        // 달력에 숫자 출력
        this.setMonthCalendarBody();
    },
    setMonthTitle: function() {
        var thisMonthFullname = monthArray[this.myDate.month];
        this.monthTitle.innerHTML = "<h2>" + thisMonthFullname + " " + this.myDate.year + "</h2>";
    },
    setMonthCalendarBody: function() {
        // 이번달 1일, 마지막날, 1일의 요일 구하기
        var firstDate = new Date(this.myDate.year, this.myDate.month, 1);
        var lastDate = this.getLastDate(this.myDate.month);
        var firstWeekday = firstDate.getDay();

        var numArr = [];

        var prevMonthLastDate = this.getLastDate(this.myDate.month - 1);
        var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;
        var currentDate = 0;
        var nextMonthDate = 1;

        // 지난달에 해당하는 날짜를 먼저 배열에 넣어준다.
        for (var i = prevMonthfirstDate; i <= prevMonthLastDate; i++) {
            this.setDataDate(this.cells[currentDate], this.cellsBackground[currentDate], this.myDate.year, this.myDate.month, i);
            if (!this.cells[currentDate].className.includes("fc-other-month")) {
                Utility.addClass(this.cells[currentDate], "fc-other-month");
            }
            currentDate++;
            numArr.push(i);
        }
        // 이번달에 해당하는 날짜를 추가로 배열에 넣어준다.
        for (var i = 1; i <= lastDate; i++) {
            this.setDataDate(this.cells[currentDate], this.cellsBackground[currentDate], this.myDate.year, this.myDate.month + 1, i);
            if (this.cells[currentDate].className.includes("fc-other-month")) {
                Utility.removeClass(this.cells[currentDate], "fc-other-month");
            }
            if (this.cellsBackground[currentDate].getAttribute("data-date") === Utility.formDate(Today.year, Today.month + 1, Today.date)) this.setToday(this.cellsBackground[currentDate]);
            else if (this.cellsBackground[currentDate].className.includes("fc-state-highlight")) this.removeToday(this.cellsBackground[currentDate]);

            currentDate++;
            numArr.push(i);
        }
        // 지난달, 이번달, 다음달에 해당하는 날짜를 달력에 보여준다.
        for (var i = 0; i < this.nums.length; i++) {
            if (numArr[i] === undefined) {
                this.setDataDate(this.cells[currentDate], this.cellsBackground[currentDate], this.myDate.year, this.myDate.month + 2, nextMonthDate);
                if (!this.cells[currentDate].className.includes("fc-other-month")) {
                    Utility.addClass(this.cells[currentDate], "fc-other-month");
                }
                currentDate++;
                numArr.push(nextMonthDate++);
            }
            this.nums[i].innerText = numArr[i];
        }
        setEvent("2017-01-24"); //임시 데이터
    },
    getLastDate: function(month) {
        if (month < 0) {
            month = 11;
        }

        var lastDate = new Date(this.myDate.year, month + 1, 0).getDate();
        return lastDate;
    },
    setDataDate: function(cell, cellBg, year, month, date) {
        cell.setAttribute("data-date", Utility.formDate(year, month, date));
        cellBg.setAttribute("data-date", Utility.formDate(year, month, date));
    },
    showCalendar: function(type) {
        this.hideAllCalendar();
        switch (type) {
            case "month":
                calendarType.month.style.display = "block";
                break;
            case "week":
                calendarType.week.style.display = "block";
                break;
            case "day":
                calendarType.day.style.display = "block";
                break;
        }
    },
    hideAllCalendar: function() {
        calendarType.month.style.display = "none";
        calendarType.week.style.display = "none";
        calendarType.day.style.display = "none";
    }
};

function setCalendar(calendar) {
    // type에 따라 달력 그리기
    switch (calendar.type) {
        case "month":
            calendar.drawMonthCalendar();
            break;
        case "week":
            drawWeekCalendar();
            break;
        case "day":
            drawDayCalendar();
            break;
    }
    // type에 따라 달력 display속성을 block
    calendar.showCalendar(calendar.type);
    // type에 따라 우상단의 type button 활성화
    setTypeButton(calendar.type, calendar.typeButtons);
    // 달력에 따라 today button 활성화/비활성화
    isToday(calendar);
    // 해당 달력에 포함되어 있는 일정 띄우기
}
