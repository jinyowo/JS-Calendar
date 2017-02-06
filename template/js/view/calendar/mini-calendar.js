function MiniCalendar() {
    this.myDate = {
        year: -1,
        month: -1,
        date: -1
    };
    this.monthTitle = _$("." + Selector.Mtitle);
    this.cells = document.querySelectorAll("." + Selector.Mcells + " td");
};
MiniCalendar.prototype = {
    init: function(base, option) {
        this.setMyDate(base);
        this.callbackList = option;

        this.drawCalendar();
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
    drawCalendar: function() {
        var thisMonthFullname = Utility.months[this.myDate.month];
        this.monthTitle.innerText = thisMonthFullname + " " + this.myDate.year;

        var numArr = this.callbackList["GET_NUMS"]();
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
    /** Button method */
    arrowButtonClickEvent: function(evt) {
        this.moveCalendar(evt.target);
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
};
