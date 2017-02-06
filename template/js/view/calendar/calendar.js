function Calendar() {
    this.myDate = {
        year: -1,
        month: -1,
        date: -1,
    };
    this.type = "";
    this.monthTitle = _$("."+Selector.title);
    this.cells = document.querySelectorAll("."+Selector.cellTop);
    this.cellsBackground = document.querySelectorAll("."+Selector.cellBg);
    this.nums = document.querySelectorAll("."+Selector.cellTop+" a");
    this.firstDay = "";
    this.lastDay = "";
    // Button set
    this.arrowButtons = [
        new Button("."+Selector.prevButton, Utility.buttonType.arrow),
        new Button("."+Selector.nextButton, Utility.buttonType.arrow),
    ];
    this.typeButtons = [
        new Button("."+Selector.monthTypeButton, Utility.buttonType.type),
        new Button("."+Selector.weekTypeButton, Utility.buttonType.type),
        new Button("."+Selector.dayTypeButton, Utility.buttonType.type),
    ];
    this.todayButton = new Button("."+Selector.todayButton, Utility.buttonType.today);
    // schedules
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
    },
    setType: function(type) {
        this.type = type;
    },
    setMyDate: function(base) {
        for(var i in this.myDate) {
            this.myDate[i] = base[i];
        }
    },
    setToday: function(ele) {
        Utility.addClass(ele, Selector.today);
        Utility.addClass(ele, Style.todayEffect);
    },
    removeToday: function(ele) {
        Utility.removeClass(ele, Selector.today);
        Utility.removeClass(ele, Style.todayEffect);
    },
    setCalendar: function() {
        this.drawCalendar();
        // 해당 달력에 포함되어 있는 일정 띄우기
        this.schedules.init(this, 0, "month");
        this.schedules.setEvents();
        // type에 따라 달력 display속성을 block
        this.showCalendar();
        // type에 따라 우상단의 type button 활성화
        this.setTypeButton(this.type, this.typeButtons);
        // 달력에 따라 today button 활성화/비활성화
        this.isToday();
    },
    // 월에 맞도록 달력에 숫자를 뿌리는 함수
    drawCalendar: function() {
        switch (this.type) {
            case "month":
                this.setMonthTitle();
                this.setMonthCalendarBody();
                break;
            default: break;
            /** 미구현 */
            // case "week":
            //     this.setWeekTitle();
            //     this.setWeekCalendarBody();
            //     break;
            // case "day":
            //     this.setDayTitle();
            //     this.setDayCalendarBody();
            //     break;
        }
    },
    setMonthTitle: function() {
        var thisMonthFullname = Utility.months[this.myDate.month];
        this.monthTitle.innerHTML = "<h2>" + thisMonthFullname + " " + this.myDate.year + "</h2>";
    },
    setMonthCalendarBody: function() {
        // 이번달 1일, 마지막날, 1일의 요일 구하기
        var firstDate = new Date(this.myDate.year, this.myDate.month, 1);
        var lastDate = this.getLastDate(this.myDate.month);
        var firstWeekday = firstDate.getDay();

        var numArr = [];

        var prevYear = this.myDate.year;
        if(this.myDate.month===0) { prevYear--;}
        var prevMonthLastDate = this.getLastDate(this.myDate.month - 1);

        var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;
        var currentDate = 0;
        var nextMonthDate = 1;

        // 지난달에 해당하는 날짜를 먼저 배열에 넣어준다.
        for (var i = prevMonthfirstDate; i <= prevMonthLastDate; i++) {
            this.setDataDate(this.cells[currentDate], this.cellsBackground[currentDate], prevYear, this.myDate.month, i);
            if (!this.cells[currentDate].className.includes(Selector.otherMonth)) {
                Utility.addClass(this.cells[currentDate], Selector.otherMonth);
            }
            currentDate++;
            numArr.push(i);
        }
        // 이번달에 해당하는 날짜를 추가로 배열에 넣어준다.
        for (var i = 1; i <= lastDate; i++) {
            this.setDataDate(this.cells[currentDate], this.cellsBackground[currentDate], this.myDate.year, this.myDate.month + 1, i);
            if (this.cells[currentDate].className.includes(Selector.otherMonth)) {
                Utility.removeClass(this.cells[currentDate], Selector.otherMonth);
            }
            currentDate++;
            numArr.push(i);
        }
        // 지난달, 이번달, 다음달에 해당하는 날짜를 달력에 보여준다.
        for (var i = 0; i < this.nums.length; i++) {
            if (numArr[i] === undefined) {
                this.setDataDate(this.cells[currentDate], this.cellsBackground[currentDate], this.myDate.year, this.myDate.month + 2, nextMonthDate);
                if (!this.cells[currentDate].className.includes(Selector.otherMonth)) {
                    Utility.addClass(this.cells[currentDate], Selector.otherMonth);
                }
                currentDate++;
                numArr.push(nextMonthDate++);
            }
            if (this.cellsBackground[i].getAttribute(CustomData.date) === Utility.formDate(Utility.Today.year, Utility.Today.month + 1, Utility.Today.date)) this.setToday(this.cellsBackground[i]);
            else if (this.cellsBackground[i].className.includes(Selector.today)) this.removeToday(this.cellsBackground[i]);

            this.nums[i].innerText = numArr[i];
        }
        this.firstDay = this.cells[0].getAttribute(CustomData.date);
        this.lastDay =  this.cells[currentDate-1].getAttribute(CustomData.date);
        var schedule = new ScheduleDisplay();
        schedule.init(this, 0, "month");
        schedule.setEvents();
    },
    getLastDate: function(month) {
        if (month < 0) { month = 11;}
        var lastDate = new Date(this.myDate.year, month + 1, 0).getDate();
        return lastDate;
    },
    setDataDate: function(cell, cellBg, year, month, date) {
        cell.setAttribute(CustomData.date, Utility.formDate(year, month, date));
        cellBg.setAttribute(CustomData.date, Utility.formDate(year, month, date));
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
    // button event
    arrowButtonClickEvent: function(evt) {
        this.moveCalendar(evt.target);
        this.setCalendar(this);
    },
    typeButtonClickEvent: function(evt) {
        this.type = evt.target.innerText;
        this.resetEvent();
        this.setCalendar(this);
    },
    todayButtonClickEvent: function() {
        if (!this.isToday(this)) {
            this.setMyDate(Utility.Today);
            this.resetEvent();
            this.setCalendar(this);
        }
    },
    moveCalendar: function(target) {
        var prevArrowClass = Selector.prevButton;
        var nextArrowClass = Selector.nextButton;
        var button = target.closest("button");
        var mydate = this.myDate;
        this.resetEvent();

        if (button.classList.contains(prevArrowClass)) {
            mydate.month--;
        } else if (button.classList.contains(nextArrowClass)) {
            mydate.month++;
        }
        if (mydate.month < 0) {
            mydate.month = 11;
            mydate.year--;
        } else if (mydate.month > 11) {
            mydate.month = 0;
            mydate.year++;
        }
    },
    setTypeButton: function(type, typeButtons) {
        this.inactiveButtonSet(typeButtons, Style.activeEffect);
        var typeOrder = ["month", "week", "day"];
        Utility.addClass(typeButtons[typeOrder.indexOf(type)].ele, Style.activeEffect);

        return typeButtons;
    },
    inactiveButtonSet: function(buttons, className) {
        for(var i in buttons) {
            Utility.removeClass(buttons[i].ele, className);
        }
    },
    isToday: function() {
        var mydate = this.myDate;
        if (mydate.year !== Utility.Today.year || mydate.month !== Utility.Today.month || mydate.date !== Utility.Today.date) {
            this.todayButton.active();
            return false;
        } else {
            this.todayButton.inactive();
            return true;
        }
    },
    resetEvent: function() {
        this.resetField();
        var eventRow = document.querySelectorAll("."+Selector.scheduleSkeleton+" tbody");

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
