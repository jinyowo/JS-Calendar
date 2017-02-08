function Calendar() {
    this.myDate = {
        year: -1,
        month: -1,
        date: -1,
    };
    this.type = '';
    this.monthTitle = $('.' + Selector.title);
    this.cells = $('.' + Selector.cellTop);
    this.cellsBg = $('.' + Selector.cellBg);
    this.nums = $('.' + Selector.cellTop).find('a');
    this.firstDay = '';
    this.lastDay = '';
    /** Button set */
    this.arrowButtons = [
        new Button('.' + Selector.prevButton, Utility.buttonType.arrow),
        new Button('.' + Selector.nextButton, Utility.buttonType.arrow),
    ];
    this.typeButtons = [
        new Button('.' + Selector.monthTypeButton, Utility.buttonType.type),
        new Button('.' + Selector.weekTypeButton, Utility.buttonType.type),
        new Button('.' + Selector.dayTypeButton, Utility.buttonType.type),
    ];
    this.todayButton = new Button('.' + Selector.todayButton, Utility.buttonType.today);
};

Calendar.prototype = {
    init: function(type, base, schedules, option) {
        this.setType(type);
        this.schedules = schedules;
        this.callbackList = option;
        // Button init
        for (var i = 0; i < this.arrowButtons.length; i++) {
            this.arrowButtons[i].init(this, this.arrowButtonClickEvent.bind(this), {});
        }
        for (var i = 0; i < this.typeButtons.length; i++) {
            this.typeButtons[i].init(this, this.typeButtonClickEvent.bind(this), {});
        }
        this.todayButton.init(this, this.todayButtonClickEvent.bind(this), {});
        this.setCalendar(base);
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
        $(ele).addClass(Selector.today);
        $(ele).addClass(Style.todayEffect);
    },
    removeToday: function(ele) {
        $(ele).removeClass(Selector.today);
        $(ele).removeClass(Style.todayEffect);
    },
    /** set Calendar */
    setCalendar: function(date) {
        this.setMyDate(date);
        this.drawCalendar(date);
        // 해당 달력에 포함되어 있는 일정 띄우기
        this.resetEvent();
        this.schedules.init(this, 0, 'month');
        this.schedules.setEvents();

        this.showCalendar();    // type에 따라 달력 display속성을 block
        this.setTypeButton(this.type, this.typeButtons); // type에 따라 우상단의 type button 활성화
        this.isToday(); // 달력에 따라 today button 활성화/비활성화
    },
    drawCalendar: function(date) {
        this.setMonthTitle(date);
        this.setMonthCalendarBody(date);
    },
    setMonthTitle: function(date) {
        var thisMonthFullname = Utility.months[date.month];
        this.monthTitle.html('<h2>' + thisMonthFullname + ' ' + date.year + '</h2>');
    },
    setMonthCalendarBody: function(date) {
        var result = this.calculateCalendar(date);
        var notThisMonth = true;
        // 날짜출력, today 셋팅
        for (var i = 0; i < this.cells.length; i++) {
            if(result[0][i] === 1) notThisMonth = !notThisMonth;
            if(notThisMonth) $(this.cells[i]).addClass(Selector.otherMonth);
            else $(this.cells[i]).removeClass(Selector.otherMonth);

            if ($(this.cellsBg[i]).attr(CustomData.date) === Utility.formDate(Utility.Today.year, Utility.Today.month + 1, Utility.Today.date)) this.setToday(this.cellsBg[i]);
            else if ($(this.cellsBg[i]).hasClass(Selector.today)) this.removeToday(this.cellsBg[i]);

            $(this.nums[i]).text(result[0][i]);
        }
    },
    calculateCalendar: function(date) {
        var numArr = [];
        var currentDate = 0;
        currentDate = this.prevMonth(numArr, currentDate, date); // 지난달 날짜계산
        currentDate = this.thisMonth(numArr, currentDate, date); // 이번달 날짜계산
        currentDate = this.nextMonth(numArr, currentDate, date); // 다음달 날짜계산

        this.firstDay = $(this.cells[0]).attr(CustomData.date);
        this.lastDay = $(this.cells[currentDate - 1]).attr(CustomData.date);
        return [numArr, this.firstDay, this.lastDay];
    },
    prevMonth: function(numArr, currentDate, base) {
        var firstDate = new Date(base.year, base.month, 1);
        var firstWeekday = firstDate.getDay();
        var prevYear =  base.year;
        if ( base.month === 0) {
            prevYear--;
        }
        var prevMonthLastDate = this.getLastDate( base.month - 1);
        var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;

        for (var i = prevMonthfirstDate; i <= prevMonthLastDate; i++) {
            this.setCells(prevYear, base.month, i, currentDate++, numArr);
        }
        return currentDate;
    },
    thisMonth: function(numArr, currentDate, base) {
        var lastDate = this.getLastDate( base.month);
        for (var i = 1; i <= lastDate; i++) {
            this.setCells(base.year, base.month + 1, i, currentDate++, numArr);
        }
        return currentDate;
    },
    nextMonth: function(numArr, currentDate, base) {
        var nextMonthDate = 1;
        for (var i = currentDate; i < this.cells.length; i++) {
            this.setCells(base.year, base.month + 2, nextMonthDate++, currentDate++, numArr);
        }
        return currentDate;
    },
    setCells: function(year, month, date, currentDate, numArr) {
        $(this.cells[currentDate]).attr(CustomData.date, Utility.formDate(year, month, date));
        $(this.cellsBg[currentDate]).attr(CustomData.date, Utility.formDate(year, month, date));
        numArr.push(date);
    },
    getLastDate: function(month) {
        if (month < 0) month = 11;
        var lastDate = new Date(this.myDate.year, month + 1, 0).getDate();
        return lastDate;
    },
    showCalendar: function() {
        this.hideAllCalendar();
        $(Utility.calendarType[this.type]).show();
    },
    hideAllCalendar: function() {
        for(var i in Utility.calendarType) {
            $(Utility.calendarType[i]).hide();
        }
    },
    /** Button method */
    arrowButtonClickEvent: function(evt) {
        this.moveCalendar(evt.target);
        this.callbackList['SET_MINI'](this.myDate);
        this.resetEvent();
        this.setCalendar(this.myDate);
    },
    typeButtonClickEvent: function(evt) {
        this.type = $(evt.target).text();
        this.resetEvent();
        this.setCalendar(this.myDate);
    },
    todayButtonClickEvent: function() {
        if (this.isToday(this)) return false;

        this.setMyDate(Utility.Today);
        this.callbackList['SET_MINI'](this.myDate);
        this.resetEvent();
        this.setCalendar(this.myDate);
    },
    moveCalendar: function(target) {
        var prevArrowClass = Selector.prevButton;
        var nextArrowClass = Selector.nextButton;
        var button = target.closest('button');

        if ($(button).hasClass(prevArrowClass)) this.myDate.month--;
        else if ($(button).hasClass(nextArrowClass)) this.myDate.month++;

        if (this.myDate.month < 0) {
            this.myDate.month = 11;
            this.myDate.year--;
        } else if (this.myDate.month > 11) {
            this.myDate.month = 0;
            this.myDate.year++;
        }
    },
    setTypeButton: function(type, typeButtons) {
        this.inactiveButtonSet(typeButtons, Style.activeEffect);
        var typeOrder = ['month', 'week', 'day'];
        $(typeButtons[typeOrder.indexOf(type)].ele).addClass(Style.activeEffect);

        return typeButtons;
    },
    inactiveButtonSet: function(buttons, className) {
        for (var i in buttons) {
            $(buttons[i].ele).removeClass(className);
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
            $(this.todayButton.ele).removeClass(Style.hoverEffect);
            this.todayButton.inactive();
            return true;
        }
    },
    /** schedule method */
    resetEvent: function() {
        this.resetField();
        var eventRow = $('.' + Selector.scheduleSkeleton).find('tbody');

        for (var i = 0; i < eventRow.length; i++) {
            $(eventRow[i]).html('<tr>' +
                '\n<td></td>' +
                '\n<td></td>' +
                '\n<td></td>' +
                '\n<td></td>' +
                '\n<td></td>' +
                '\n<td></td>' +
                '\n<td></td>' +
                '\n</tr>');
        }
    },
    resetField: function() {
        var weekRow = $('.'+Selector.monthView).find('.fc-week');
        for (var i = 0; i < weekRow.length; i++) {
            $(weekRow[i]).css('height', '107px');
        }
        $('.'+Selector.monthView).find('.fc-scroller').css('height', '647px');
    }
};
