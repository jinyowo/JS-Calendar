function Button(selector, type) {
    this.ele = document.querySelector(selector);
    this.type = type;
    this.onClickEvent = type + "ButtonClickEvent";
}

Button.prototype = {
    init: function(_calendar, option) {
        this.ele.addEventListener("mouseover", this.onMouseOver.bind(this));
        this.ele.addEventListener("mouseout", this.onMouseOut.bind(this));
        this.ele.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.ele.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.ele.addEventListener("click", this[this.onClickEvent].bind(this));

        this.callbackList = option;
        this.calendar = _calendar;
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
            setCalendar(this.calendar);
        }
    },
    moveCalendar: function(type) {
        var prevArrowClass = "fc-prev-button";
        var nextArrowClass = "fc-next-button";

        var button = this.ele.closest("button");
        Utility.resetEvent();
        var base = type;
        if (button.classList.contains(prevArrowClass)) {
            this.calendar.myDate.month--;
        } else if (button.classList.contains(nextArrowClass)) {
            this.calendar.myDate.month++;
        }

        if (this.calendar.myDate.month < 0) {
            this.calendar.myDate.month = 11;
            this.calendar.myDate.year--;
        } else if (this.calendar.myDate.month > 11) {
            this.calendar.myDate.month = 0;
            this.calendar.myDate.year++;
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
    switch (type) {
        case "month":
            Utility.addClass(typeButtons[0].ele, "fc-state-active");
            break;
        case "week":
            Utility.addClass(typeButtons[1].ele, "fc-state-active");
            break;
        case "day":
            Utility.addClass(typeButtons[2].ele, "fc-state-active");
            break;
    }
    return typeButtons;
}

function inactiveAllTypeButton(typeButtons) {
    Utility.removeClass(typeButtons[0].ele, "fc-state-active");
    Utility.removeClass(typeButtons[1].ele, "fc-state-active");
    Utility.removeClass(typeButtons[2].ele, "fc-state-active");
}

function isToday(calendar) {
    if (calendar.myDate.year !== Today.year || calendar.myDate.month !== Today.month || calendar.myDate.date !== Today.date) {
        calendar.todayButton.active();
        return false;
    } else {
        calendar.todayButton.inactive();
        return true;
    }
}
