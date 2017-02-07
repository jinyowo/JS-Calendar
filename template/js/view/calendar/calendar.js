function Calendar() {
    this.myDate = {
        year: -1,
        month: -1,
        date: -1,
    };
    this.type = "";
    this.monthTitle = _$("." + Selector.title);
    this.cells = document.querySelectorAll("." + Selector.cellTop);
    this.cellsBg = document.querySelectorAll("." + Selector.cellBg);
    this.nums = document.querySelectorAll("." + Selector.cellTop + " a");
    this.firstDay = "";
    this.lastDay = "";
    /** Button set */
    this.arrowButtons = [
        new Button("." + Selector.prevButton, Utility.buttonType.arrow),
        new Button("." + Selector.nextButton, Utility.buttonType.arrow),
    ];
    this.typeButtons = [
        new Button("." + Selector.monthTypeButton, Utility.buttonType.type),
        new Button("." + Selector.weekTypeButton, Utility.buttonType.type),
        new Button("." + Selector.dayTypeButton, Utility.buttonType.type),
    ];
    this.todayButton = new Button("." + Selector.todayButton, Utility.buttonType.today);
    /** schedules */
    this.schedules = new ScheduleDisplay();
};

Calendar.prototype = {
    init: function(type, base, option) {
        this.setType(type);
        this.setMyDate(base);
        this.callbackList = option;
        // Button init
        for (var i = 0; i < this.arrowButtons.length; i++) {
            this.arrowButtons[i].init(this, this.arrowButtonClickEvent.bind(this), {});
        }
        for (var i = 0; i < this.typeButtons.length; i++) {
            this.typeButtons[i].init(this, this.typeButtonClickEvent.bind(this), {});
        }
        this.todayButton.init(this, this.todayButtonClickEvent.bind(this), {});
        this.setCalendar();
    },
    setType: function(type) {
        this.type = type;
    },
    setMyDate: function(base) {
        for (var i in this.myDate) {
            this.myDate[i] = base[i];
        }
    },
    setNums: function(numArr) {
        this.numArr = numArr;
    },
    setToday: function(ele) {
        Utility.addClass(ele, Selector.today);
        Utility.addClass(ele, Style.todayEffect);
    },
    removeToday: function(ele) {
        Utility.removeClass(ele, Selector.today);
        Utility.removeClass(ele, Style.todayEffect);
    },
    /** set Calendar */
    setCalendar: function() {
        this.drawCalendar();
        // 해당 달력에 포함되어 있는 일정 띄우기
        this.schedules.init(this, 0, "month");
        this.schedules.setEvents();

        this.showCalendar();    // type에 따라 달력 display속성을 block
        this.setTypeButton(this.type, this.typeButtons); // type에 따라 우상단의 type button 활성화
        this.isToday(); // 달력에 따라 today button 활성화/비활성화
    },
    drawCalendar: function() {
        this.setMonthTitle();
        this.setMonthCalendarBody(this.myDate);
    },
    setMonthTitle: function() {
        var thisMonthFullname = Utility.months[this.myDate.month];
        this.monthTitle.innerHTML = "<h2>" + thisMonthFullname + " " + this.myDate.year + "</h2>";
    },
    setMonthCalendarBody: function(date) {
        var result = this.calculateCalendar(date);
        var notThisMonth = true;
        // 날짜출력, today 셋팅
        for (var i = 0; i < this.cells.length; i++) {
            if(result[0][i] === 1) notThisMonth = !notThisMonth;
            if(notThisMonth) Utility.addClass(this.cells[i], Selector.otherMonth);
            else Utility.removeClass(this.cells[i], Selector.otherMonth);

            if (this.cellsBg[i].getAttribute(CustomData.date) === Utility.formDate(Utility.Today.year, Utility.Today.month + 1, Utility.Today.date)) this.setToday(this.cellsBg[i]);
            else if (this.cellsBg[i].className.includes(Selector.today)) this.removeToday(this.cellsBg[i]);

            this.nums[i].innerText = result[0][i];
        }
        this.firstDay = this.cells[0].getAttribute(CustomData.date);
        this.lastDay = this.cells[result[1] - 1].getAttribute(CustomData.date);
    },
    calculateCalendar: function(date) {
        var numArr = [];
        var currentDate = 0;
        currentDate = this.prevMonth(numArr, currentDate, date); // 지난달 날짜계산
        currentDate = this.thisMonth(numArr, currentDate, date); // 이번달 날짜계산
        currentDate = this.nextMonth(numArr, currentDate, date); // 다음달 날짜계산

        return [numArr, currentDate];
    },
    prevMonth: function(numArr, currentDate, base) {
        var firstDate = new Date(base.year,  base.month, 1);
        var firstWeekday = firstDate.getDay();
        var prevYear =  base.year;
        if ( base.month === 0) {
            prevYear--;
        }
        var prevMonthLastDate = this.getLastDate( base.month - 1);
        var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;

        for (var i = prevMonthfirstDate; i <= prevMonthLastDate; i++) {
            this.setCells(prevYear,  base.month, i, currentDate++, numArr);
        }
        return currentDate;
    },
    thisMonth: function(numArr, currentDate, base) {
        var lastDate = this.getLastDate( base.month);
        for (var i = 1; i <= lastDate; i++) {
            this.setCells( base.year,  base.month + 1, i, currentDate++, numArr);
        }
        return currentDate;
    },
    nextMonth: function(numArr, currentDate, base) {
        var nextMonthDate = 1;
        for (var i = currentDate; i < this.cells.length; i++) {
            this.setCells( base.year,  base.month + 2, nextMonthDate++, currentDate++, numArr);
        }
        return currentDate;
    },
    setCells: function(year, month, date, currentDate, numArr) {
        this.setDataDate(currentDate, year, month, date);
        numArr.push(date);
    },
    getLastDate: function(month) {
        if (month < 0) month = 11;
        var lastDate = new Date(this.myDate.year, month + 1, 0).getDate();
        return lastDate;
    },
    setDataDate: function(currentDate, year, month, date) {
        this.cells[currentDate].setAttribute(CustomData.date, Utility.formDate(year, month, date));
        this.cellsBg[currentDate].setAttribute(CustomData.date, Utility.formDate(year, month, date));
    },
    showCalendar: function() {
        this.hideAllCalendar();
        Utility.showElement(Utility.calendarType[this.type]);
    },
    hideAllCalendar: function() {
        Utility.hideElement(Utility.calendarType.month);
        Utility.hideElement(Utility.calendarType.week);
        Utility.hideElement(Utility.calendarType.day);
    },
    /** Button method */
    arrowButtonClickEvent: function(evt) {
        this.moveCalendar(evt.target);
        this.resetEvent();
        this.setCalendar(this);
    },
    typeButtonClickEvent: function(evt) {
        this.type = evt.target.innerText;
        this.resetEvent();
        this.setCalendar(this);
    },
    todayButtonClickEvent: function() {
        if (this.isToday(this)) return false;

        this.setMyDate(Utility.Today);
        this.callbackList["SET_MINI"](this.myDate);
        this.resetEvent();
        this.setCalendar(this);
    },
    moveCalendar: function(target) {
        var prevArrowClass = Selector.prevButton;
        var nextArrowClass = Selector.nextButton;
        var button = target.closest("button");

        if (button.classList.contains(prevArrowClass)) this.myDate.month--;
        else if (button.classList.contains(nextArrowClass)) this.myDate.month++;

        if (this.myDate.month < 0) {
            this.myDate.month = 11;
            this.myDate.year--;
        } else if (this.myDate.month > 11) {
            this.myDate.month = 0;
            this.myDate.year++;
        }
        this.callbackList["SET_MINI"](this.myDate);
    },
    setTypeButton: function(type, typeButtons) {
        this.inactiveButtonSet(typeButtons, Style.activeEffect);
        var typeOrder = ["month", "week", "day"];
        Utility.addClass(typeButtons[typeOrder.indexOf(type)].ele, Style.activeEffect);

        return typeButtons;
    },
    inactiveButtonSet: function(buttons, className) {
        for (var i in buttons) {
            Utility.removeClass(buttons[i].ele, className);
        }
    },
    isToday: function() {
        var mydate = this.myDate;
        if (mydate.year !== Utility.Today.year ||
            mydate.month !== Utility.Today.month ||
            mydate.date !== Utility.Today.date) {
            this.todayButton.active();
            return false;
        } else {
            this.todayButton.inactive();
            return true;
        }
    },
    /** schedule method */
    resetEvent: function() {
        this.resetField();
        var eventRow = document.querySelectorAll("." + Selector.scheduleSkeleton + " tbody");

        for (var i = 0; i < eventRow.length; i++) {
            eventRow[i].innerHTML = "<tr>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n</tr>";
        }
    },
    resetField: function() {
        var weekRow = document.querySelectorAll(".fc-month-view .fc-week");
        for (var i = 0; i < weekRow.length; i++) {
            weekRow[i].style.height = "107px";
        }
        _$(".fc-month-view .fc-scroller").style.height = "647px";
    }
};
