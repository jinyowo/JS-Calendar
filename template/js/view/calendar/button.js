function Button(selector, type) {
    this.ele = _$(selector);
    this.type = type;
    this.onClickEvent = type + "ButtonClickEvent";
}

Button.prototype = {
    init: function(_calendar, option) {
        this.registEvent();
        this.calendar = _calendar;
        this.callbackList = option;
    },
    registEvent: function() {
        this.ele.addEventListener("mouseover", this.onMouseOver.bind(this));
        this.ele.addEventListener("mouseout", this.onMouseOut.bind(this));
        this.ele.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.ele.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.ele.addEventListener("click", this[this.onClickEvent].bind(this))
    },
    onMouseOver: function() {
        Utility.addClass(this.ele, "fc-state-hover");
    },
    onMouseOut: function() {
        Utility.removeClass(this.ele, "fc-state-hover");
    },
    onMouseDown: function() {
        Utility.addClass(this.ele, "fc-state-down");
    },
    onMouseUp: function() {
        Utility.removeClass(this.ele, "fc-state-down");
    },
    arrowButtonClickEvent: function() {
        this.moveCalendar(this.calendar.type);
        setCalendar(this.calendar);
    },
    typeButtonClickEvent: function() {
        this.calendar.type = this.ele.innerText;
        Utility.resetEvent();
        setCalendar(this.calendar);
    },
    todayButtonClickEvent: function() {
        if (!isToday(this.calendar)) {
            this.calendar.setMyDate(Today);
            Utility.resetEvent();
            setCalendar(this.calendar);
        }
    },
    moveCalendar: function(type) {
        var prevArrowClass = "fc-prev-button";
        var nextArrowClass = "fc-next-button";
        var button = this.ele.closest("button");
        var mydate = this.calendar.myDate;
        Utility.resetEvent();

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
    active: function() {
        Utility.removeClass(this.ele, "fc-state-disabled");
    },
    inactive: function() {
        Utility.addClass(this.ele, "fc-state-disabled");
    }
}
function setTypeButton(type, typeButtons) {
    inactiveAllTypeButton(typeButtons);
    var typeOrder = ["month", "week", "day"];
    Utility.addClass(typeButtons[typeOrder.indexOf(type)].ele, "fc-state-active");

    return typeButtons;
}

function inactiveAllTypeButton(typeButtons) {
    for(var i in typeButtons) {
        Utility.removeClass(typeButtons[i].ele, "fc-state-active");
    }
}

function isToday(calendar) {
    var mydate = calendar.myDate;
    if (mydate.year !== Today.year || mydate.month !== Today.month || mydate.date !== Today.date) {
        calendar.todayButton.active();
        return false;
    } else {
        calendar.todayButton.inactive();
        return true;
    }
}
