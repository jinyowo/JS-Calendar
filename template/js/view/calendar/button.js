function Button(selector, type) {
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
        Utility.on(this.ele, "mouseover", this.onMouseOver.bind(this));
        Utility.on(this.ele, "mouseout", this.onMouseOut.bind(this));
        Utility.on(this.ele, "mousedown", this.onMouseDown.bind(this));
        Utility.on(this.ele, "mouseup", this.onMouseUp.bind(this));
        Utility.on(this.ele, "click", this.onClickEvent.bind(this));
    },
    onMouseOver: function() {
        Utility.addClass(this.ele, Style.hoverEffect);
    },
    onMouseOut: function() {
        Utility.removeClass(this.ele, Style.hoverEffect);
    },
    onMouseDown: function() {
        Utility.addClass(this.ele, Style.clickEffect);
    },
    onMouseUp: function() {
        Utility.removeClass(this.ele, Style.clickEffect);
    },
    active: function() {
        Utility.removeClass(this.ele, Style.disabledEffect);
    },
    inactive: function() {
        Utility.addClass(this.ele, Style.disabledEffect);
    }
};
