function Button(selector, type) {
    this.ele = document.querySelector(selector);
    this.type = type;
    this.onClickEvent = type + "ButtonClickEvent";
}

Button.prototype = {
    init: function(option) {
        this.ele.addEventListener("mouseover", this.onMouseOver.bind(this));
        this.ele.addEventListener("mouseout", this.onMouseOut.bind(this));
        this.ele.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.ele.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.ele.addEventListener("click", this[this.onClickEvent].bind(this));

        this.callbackList = option;
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
        this.moveCalendar(MyDate.type);
        setCalendar(MyDate.type);
    },
    typeButtonClickEvent : function() {
        MyDate.type = this.ele.innerText;
        Utility.resetEvent();
        setCalendar(MyDate.type);
    },
    todayButtonClickEvent : function() {
        if (!isToday()) {
            Utility.setMyDate(Today.year, Today.month, Today.date);
            setCalendar(MyDate.type);
        }
    },
    moveCalendar : function(type) {
        var prevArrowClass = "fc-prev-button";
        var nextArrowClass = "fc-next-button";

        var button = this.ele.closest("button");
        Utility.resetEvent();
        var base = type;
        if (button.classList.contains(prevArrowClass)) {
            MyDate.month--;
        } else if (button.classList.contains(nextArrowClass)) {
            MyDate.month++;
        }

        if (MyDate.month < 0) {
            MyDate.month = 11;
            MyDate.year--;
        } else if (MyDate.month > 11) {
            MyDate.month = 0;
            MyDate.year++;
        }
    },
    active : function() {
        Utility.removeClass(this.ele, "fc-state-disabled");
    },
    inactive : function() {
        Utility.addClass(this.ele, "fc-state-disabled");
    }
}

var arrowButtons = [
    new Button(".fc-prev-button", "arrow"),
    new Button(".fc-next-button", "arrow"),
];
var typeButtons = [
    new Button(".fc-month-button", "type"),
    new Button(".fc-agendaWeek-button", "type"),
    new Button(".fc-agendaDay-button", "type"),
];
var todayButton = new Button(".fc-left .fc-today-button", "today");

for(var i=0; i<arrowButtons.length; i++) arrowButtons[i].init({});
for(var i=0; i<typeButtons.length; i++) typeButtons[i].init({});
todayButton.init({});

function setTypeButton(type) {
    inactiveAllTypeButton();
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
}

function inactiveAllTypeButton() {
    Utility.removeClass(typeButtons[0].ele, "fc-state-active");
    Utility.removeClass(typeButtons[1].ele, "fc-state-active");
    Utility.removeClass(typeButtons[2].ele, "fc-state-active");
}

function isToday() {
    if (MyDate.year !== Today.year || MyDate.month !== Today.month || MyDate.date !== Today.date) {
        todayButton.active();
        return false;
    } else {
        todayButton.inactive();
        return true;
    }
}
