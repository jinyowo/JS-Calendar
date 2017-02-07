function MiniCalendar() {
    this.myDate = {
        year: -1,
        month: -1,
        date: -1
    };
    this.monthTitle = _$("." + Selector.Mtitle);
    this.body = document.querySelector("." + Selector.Mcells);
    this.cells = this.body.querySelectorAll("td");
    this.prevButton = document.querySelector("." + Selector.MprevButton);
    this.nextButton = document.querySelector("." + Selector.MnextButton);
};
MiniCalendar.prototype = {
    init: function(base, option) {
        this.callbackList = option;
        Utility.on(this.prevButton, "click", this.arrowClickEvent.bind(this));
        Utility.on(this.nextButton, "click", this.arrowClickEvent.bind(this));
        Utility.on(this.body, "click", this.moveToDate.bind(this));
        this.drawCalendar(base);
    },
    setMyDate: function(base) {
        for (var i in this.myDate) {
            this.myDate[i] = base[i];
        }
    },
    setToday: function(ele) {
        Utility.addClass(ele, Selector.Mtoday);
    },
    removeToday: function(ele) {
        Utility.removeClass(ele, Selector.Mtoday);
    },
    moveToDate: function() {
        var dateStr = event.target.getAttribute("data-date");
        var year = dateStr.slice(0, 4) * 1,
            month = dateStr.slice(5, 7) * 1 -1,
            date = dateStr.slice(8) * 1;
        this.callbackList["SET_NUMS"]({year, month, date});
        this.resetSelected();
        for(var i in this.cells) {
            if(this.cells[i] !== event.target) continue;
            Utility.addClass(this.cells[i], Selector.Mselected);
        }
    },
    drawCalendar: function(base) {
        this.setMyDate(base);

        var thisMonthFullname = Utility.months[this.myDate.month];
        this.monthTitle.innerText = thisMonthFullname + " " + this.myDate.year;

        var numArr = this.callbackList["GET_NUMS"](this.myDate)[0];
        // var events = this.callbackList["GET_EVENT"](this.myDate);
        // var vaildEvents = this.getEvent(events);
        var year = this.myDate.year;
        var month = this.myDate.month;
        var notThisMonth = true;
        for(var i=0; i<this.cells.length; i++) {
            if(numArr[i] === 1) {
                notThisMonth = !notThisMonth;
                month++;
            }
            if(notThisMonth) Utility.addClass(this.cells[i], Selector.MotherMonth);
            else Utility.removeClass(this.cells[i], Selector.MotherMonth);

            if (month === 0) {
                this.cells[i].setAttribute(CustomData.date, Utility.formDate(this.myDate.year-1, month, numArr[i]));
            } else {
                this.cells[i].setAttribute(CustomData.date, Utility.formDate(this.myDate.year, month, numArr[i]));
            }
            this.cells[i].innerText = numArr[i];

            if (this.cells[i].getAttribute(CustomData.date) === Utility.formDate(Utility.Today.year, Utility.Today.month + 1, Utility.Today.date)) this.setToday(this.cells[i]);
            else if (this.cells[i].className.includes(Selector.Mtoday)) this.removeToday(this.cells[i]);
        }
    },
    getEvent: function(events) {
        var result = [];
        for(var i=0; i<events.length; i++) {
            if(events[i].repeat === "none") {   // 반복일정이 아니면 일정의 시작과 끝을 모두 검사

            }
            else {  // 반복일정은 일정의 시작만 검사

            }
        }
        return result;
    },
    /** Button method */
    arrowClickEvent: function(evt) {
        this.resetSelected();
        this.moveCalendar(evt.target);
        this.drawCalendar(this.myDate);
    },
    moveCalendar: function(target) {
        var prevArrowClass = Selector.MprevButton;
        var nextArrowClass = Selector.MnextButton;

        if (target.classList.contains(prevArrowClass)) this.myDate.month--;
        else if (target.classList.contains(nextArrowClass)) this.myDate.month++;

        if (this.myDate.month < 0) {
            this.myDate.month = 11;
            this.myDate.year--;
        } else if (this.myDate.month > 11) {
            this.myDate.month = 0;
            this.myDate.year++;
        }
    },
    /** schedule clear */
    resetSelected: function() {
        for(var i=0; i<this.cells.length; i++) {
            if(this.cells[i].classList.contains(Selector.Mselected)) {
                Utility.removeClass(this.cells[i], Selector.Mselected);
                break;
            }
        }
    },
};
