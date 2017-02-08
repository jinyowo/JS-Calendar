function Button(selector, type) {
    this.ele = $('.'+Selector.topDiv).find(selector);
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
        $(this.ele).mouseover(this.onMouseOver.bind(this));
        $(this.ele).mouseout(this.onMouseOut.bind(this));
        $(this.ele).mousedown(this.onMouseDown.bind(this));
        $(this.ele).mouseup(this.onMouseUp.bind(this));
        $(this.ele).click(this.onClickEvent.bind(this));
    },
    onMouseOver: function() {
        if($(this.ele).hasClass(Style.disabledEffect)) return 0;
        $(this.ele).addClass(Style.hoverEffect);
    },
    onMouseOut: function() {
        $(this.ele).removeClass(Style.hoverEffect);
    },
    onMouseDown: function() {
        $(this.ele).addClass(Style.clickEffect);
    },
    onMouseUp: function() {
        $(this.ele).removeClass(Style.clickEffect);
    },
    active: function() {
        $(this.ele).removeClass(Style.disabledEffect);
    },
    inactive: function() {
        $(this.ele).addClass(Style.disabledEffect);
    }
};
