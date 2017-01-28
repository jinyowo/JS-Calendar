function Calendar() {
    this.myDate = {
        year: -1,
        month: -1,
        date: -1,
    };
    this.type = "";
    //이 코드에도 css class이름이 코드안에 다 그대로 있는데, css class만 모아둔 object하나 만드세요.
    this.monthTitle = _$(".fc-center");
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
        //보통 for 문은 {} 를 생략하지 않아요.
        //forEach를 써도 되고요.
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
    //이 함수는 초기화 하는 과정에서 한번만 불리는 거 갔은데요.  함수에서 처리하는게 상대적으로 오래 걸리는 일로 보이니, 혹시 자주 불리면 cache를 해서 재사용하는 것도 필요한지 살펴보세요.
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

        //아래 for문 세개있는 코드가 전체적으로 가로로 너무 길어서 읽기가 어렵네요.
        //if문안에 사용하는 비교문이 길면 변수에 넣고 그 변수만 if문에서 비교하도록 해보세요
        //for문 갯수만큼 3개의 함수로 분리해서 가독성을 높이는게 좋겠고요.

        //
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
    //참고로 인자가 많고 그 성질이 하나의 묶음으로 표현할수 있는 데이터면, object형태로 하나의 인자로 받을 수도 있어요. 
    setDataDate: function(cell, cellBg, year, month, date) {
        cell.setAttribute("data-date", Utility.formDate(year, month, date));
        cellBg.setAttribute("data-date", Utility.formDate(year, month, date));
    },
    showCalendar: function() {
        this.hideAllCalendar();
        //아래 switch코드 지우고 이렇게..
        //Utility.showElement(calendarType[this.type]);
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
