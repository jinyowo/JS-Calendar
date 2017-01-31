var Button = function(selector, type) {
    this.ele = _$(".fc-toolbar")._$(selector);
    this.type = type;
};
Button.prototype = {
    init: function(_calendar, onClickEvent, option) {
        this.calendar = _calendar;
        this.onClickEvent = onClickEvent;
        this.callbackList = option;
        this.registEvent();
    },
    registEvent: function() {
        this.ele.addEventListener("mouseover", this.onMouseOver.bind(this));
        this.ele.addEventListener("mouseout", this.onMouseOut.bind(this));
        this.ele.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.ele.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.ele.addEventListener("click", this.onClickEvent.bind(this));
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
    active: function() {
        Utility.removeClass(this.ele, "fc-state-disabled");
    },
    inactive: function() {
        Utility.addClass(this.ele, "fc-state-disabled");
    }
};
