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
        this.resetSelected();
        this.resetEvent();
        var thisMonthFullname = Utility.months[this.myDate.month];
        this.monthTitle.innerText = thisMonthFullname + " " + this.myDate.year;

        var numArr = this.callbackList["GET_NUMS"](this.myDate)[0];
        var events = this.callbackList["GET_EVENT"];
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
        this.setEventOnCalendar(events);
    },
    getEvent: function(events) {
        var result = [];
        var startDate = this.callbackList["GET_NUMS"](this.myDate)[1];
        for(var i=0; i<events.length; i++) {
            var eventArray = JSON.parse(events[i]);
            for(var j = 0; j < eventArray.length; j++) {
                event = eventArray[j];
                if(event.repeat === "none"
                || event.start > startDate) {   // 반복일정이 아니면 해당 달에 존재하므로 추가
                    result.push(event);
                }
            }
        }
        return result;
    },
    setEventOnCalendar: function(events) {
        var validEvents = this.getEvent(events);
        var startDate = this.callbackList["GET_NUMS"](this.myDate)[1];
        var endDate = this.callbackList["GET_NUMS"](this.myDate)[2];

        for (var i = 0; i < validEvents.length; i++) {
            var event = validEvents[i];
            var start = event.start.slice(0, 10);
            var end = event.end.slice(0, 10);

            if (start < startDate) {
                start = startDate;
            }
            if (end > endDate) {
                end = endDate;
            }

            var curr = 0;
            while (this.cells[curr].getAttribute(CustomData.date) !== start) {
                curr++;
            }
            while (this.cells[curr].getAttribute(CustomData.date) <= end) {
                if (!this.cells[curr].classList.contains(Selector.Mevent)) {
                    Utility.addClass(this.cells[curr], Selector.Mevent);
                }
                curr++;
            }
        }
    },
    /** Button method */
    arrowClickEvent: function(evt) {
        this.resetEvent();
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
    resetEvent: function() {
        for(var i=0; i<this.cells.length; i++) {
            if(this.cells[i].classList.contains(Selector.Mevent)) {
                Utility.removeClass(this.cells[i], Selector.Mevent);
            }
        }
    }
};
