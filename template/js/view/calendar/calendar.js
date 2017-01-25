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
    this.firstDay = "";
    this.lastDay = "";
    // Button set
    this.arrowButtons = [
        new Button(".fc-prev-button", buttonType.arrow),
        new Button(".fc-next-button", buttonType.arrow),
    ];
    this.typeButtons = [
        new Button(".fc-month-button", buttonType.type),
        new Button(".fc-agendaWeek-button", buttonType.type),
        new Button(".fc-agendaDay-button", buttonType.type),
    ];
    this.todayButton = new Button(".fc-left .fc-today-button", buttonType.today);
}

Calendar.prototype = {
    init: function(base, option) {
        this.setMyDate(base);
        this.callbackList = option;
        // Button init
        for (var i = 0; i < this.arrowButtons.length; i++) this.arrowButtons[i].init(this,{});
        for (var i = 0; i < this.typeButtons.length; i++) this.typeButtons[i].init(this,{});
        this.todayButton.init(this,{});
    },
    setType: function(type) {
        this.type = type;
    },
    setMyDate: function(base) {
        // this.myDate = base;
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
    drawCalendar: function() {
        switch (this.type) {
            case "month":
                this.setMonthTitle();
                this.setMonthCalendarBody();
                break;
            case "week":
                this.setWeekTitle();
                this.setWeekCalendarBody();
                break;
            case "day":
                this.setDayTitle();
                this.setDayCalendarBody();
                break;
        }

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
        this.firstDay = this.cells[0].getAttribute("data-date");
        this.lastDay =  this.cells[currentDate-1].getAttribute("data-date");
        var schedule = new ScheduleDisplay();
        schedule.init(this, 0, "month");
        schedule.setEvents();
    },
    setWeekTitle: function() {

    },
    setWeekCalendarBody: function() {
    },
    setDayTitle: function() {
    },
    setDayCalendarBody: function() {

    },
    getLastDate: function(month) {
        if (month < 0) { month = 11;}
        var lastDate = new Date(this.myDate.year, month + 1, 0).getDate();
        return lastDate;
    },
    setDataDate: function(cell, cellBg, year, month, date) {
        cell.setAttribute("data-date", Utility.formDate(year, month, date));
        cellBg.setAttribute("data-date", Utility.formDate(year, month, date));
    },
    showCalendar: function() {
        this.hideAllCalendar();
        switch (this.type) {
            case "month": Utility.showElement(calendarType.month); break;
            case "week": Utility.showElement(calendarType.week); break;
            case "day": Utility.showElement(calendarType.day); break;
        }
    },
    hideAllCalendar: function() {
        Utility.hideElement(calendarType.month);
        Utility.hideElement(calendarType.week);
        Utility.hideElement(calendarType.day);
    }
};
