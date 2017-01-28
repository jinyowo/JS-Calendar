function Button(selector, type) {
    this.ele = _$(selector);
    this.type = type;
    /*
    Button 클래스가 좀 커보이는 거 같아요. type_buttonclickevent 함수를 button에서 정의하지 않고 calendar클래스 안에서 
    정의하고 함수를 인자로 넘기는 건 어때요?
    */
    this.onClickEvent = type + "ButtonClickEvent";
}

Button.prototype = {
    init: function(_calendar, option) {
        //register하는 것만 따로 묶어 두어도 좋을 듯.
        this.ele.addEventListener("mouseover", this.onMouseOver.bind(this));
        this.ele.addEventListener("mouseout", this.onMouseOut.bind(this));
        this.ele.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.ele.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.ele.addEventListener("click", this[this.onClickEvent].bind(this));

        this.callbackList = option;
        this.calendar = _calendar;
    },
    onMouseOver: function() {
        //fc-state-hover, down 등의 이름을 button클래스 여기저기에서 하드코딩해서 사용중인데요, 이렇게 하지 않고 생성자나 init함수 안에서 객체형태로 정의하고 사용하는게 좋을 듯.
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
        //이렇게 컴포넌트안에서 외부에 선언된 전역함수를 부르는건 별로인 거 같아요. 외부함수를 받아서 사용하면 모를까..방법을 좀더 고민해보세요.
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
        //base는 안쓰이는 듯?
        var base = type;

        //자주쓰는 객체는 지역변수에 담아두고 쓰면 더 빠르게 처리 됨
        //var myData = this.calendar.myDate;
        if (button.classList.contains(prevArrowClass)) {
            this.calendar.myDate.month--;
        } else if (button.classList.contains(nextArrowClass)) {
            this.calendar.myDate.month++;
        }

        //A인가 B인가 판단하려면, if-elseif가 아니고 그냥 if-else사용.
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

    //아래코드의 switch를 이렇게 없앨 수도 있겠네요.
    /*
    var typeOrder = ["month", "week", "day"]; //여기함수 또는 적절한곳에서 선언해두기.
    Utility.addClass(typeButton[typeOrder.indexOf(type)].ele, "fc_state-active");
    */
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
    // 아..이코드는 loop를 써도 되겠군요
    Utility.removeClass(typeButtons[0].ele, "fc-state-active");
    Utility.removeClass(typeButtons[1].ele, "fc-state-active");
    Utility.removeClass(typeButtons[2].ele, "fc-state-active");
}

function isToday(calendar) {
    //var mydate = calendar.myDate; 라고 지역변수로 담아서 사용하기.
    if (calendar.myDate.year !== Today.year || calendar.myDate.month !== Today.month || calendar.myDate.date !== Today.date) {
        calendar.todayButton.active();
        return false;
    } else {
        calendar.todayButton.inactive();
        return true;
    }
}
