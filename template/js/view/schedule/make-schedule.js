function FormView() {
    this.calendarCell = _$('.fc-widget-content');
    this.container = _$('.scheduleBackground');
    this.submitInfo = new Submission();
    this.scheduleButton = _$("#scheduleButton");
}
FormView.prototype = {
    init: function() {
        Utility.on(this.calendarCell, "click", this.getDateInfo.bind(this));
        Utility.on(document, "click", this.hideInputForm.bind(this));
        Utility.on(this.scheduleButton, "click", this.makeSchduleByButton.bind(this));
    },
    getDateInfo: function() {
        this.dateData = event.target.getAttribute("data-date");
        if (event.target.className === "fc-day-number") {
            this.dateData = event.target.parentNode.getAttribute("data-date");
        }
        if (!!this.dateData) {
            this.showInputForm();
            this.makeEvent();
            this.compareTime.bind(this)();
        }
    },
    makeSchduleByButton: function() {
        this.showInputForm();
        this.makeEvent();
        this.compareTime.bind(this)();
        this.dayInput();
    },
    dayInput: function() {
        var date = new Date();
        var ISODate = date.toISOString().split("T", 1);
        this.submitInfo.startDayInput.value = ISODate;
        this.submitInfo.endDayInput.value = ISODate;
    },
    compareTime: function() {
        var time = this.submitInfo.startTimeInput.value;
        var a = time.split(':');
        var ts = ((a[0] * 60) * 60) + (a[1] * 60); // 현재시간을 초로 변환
        if (ts >= 82800) { // 원하는 시간을 초로 바꿔서 현재시간을 초로 변환한 값과 비교
            var parsedDate = this.dateData.split("-", 3);
            var day = parseInt(parsedDate[2]) + 1;
            this.submitInfo.endDayInput.value = parsedDate[0] + "-" + parsedDate[1] + "-" + day;
        }
    },
    makeEvent: function() {
        this.getCurrentTime();
        var StartDay = this.dateData;
        var StartTime = this.Date1[0] + ':' + this.Date1[1];
        var EndDay = this.dateData;
        var EndTime = this.Date2[0] + ':' + this.Date2[1];
        this.submitInfo.startDayInput.value = StartDay;
        this.submitInfo.startTimeInput.value = StartTime;
        this.submitInfo.endDayInput.value = EndDay;
        this.submitInfo.endTimeInput.value = EndTime;
    },
    getCurrentTime: function() {
        var date = new Date();
        var timedate1 = date.toTimeString();
        this.Date1 = timedate1.split(':', 2);
        date.setHours(date.getHours() + 1);
        var timedate2 = date.toTimeString();
        this.Date2 = timedate2.split(':', 2);
    },
    showInputForm: function() {
        this.submitInfo.submitButton.style.display = "inline-block";
        _$("#modify").style.display = "none";
        Utility.showElement(this.container);
    },
    hideInputForm: function(event) {
        if (this.isTarget(event.target)) {
            Utility.hideElement(this.container);
            this.submitInfo.clearInput.call(modifyInfo);
        }
    },
    isTarget: function(target) {
        var evtClass = target.className;
        var evtId = target.id;
        if (evtClass === "scheduleBackground" || evtClass === "closeButton" || evtId === "cancel") {
            return true;
        } else return false;
    }
};

function Submission() {
    this.titleInput = _$("#title");
    this.allDayButton = _$('#allDay');
    this.submitButton = _$('#submit');
    this.inputIdList1 = ["title", "place", "desc"];
    this.inputIdList2 = [
        ["startDay", "startTime"],
        ["endDay", "endTime"]
    ];
    this.startDayInput = _$("#startDay");
    this.startTimeInput = _$("#startTime");
    this.endDayInput = _$("#endDay");
    this.endTimeInput = _$("#endTime");
    this.cell = document.querySelectorAll("td.fc-day.fc-widget-content:not(.fc-past)");
}
Submission.prototype = {
    init: function(option) {
        this.callbacklist = option;
        Utility.on(this.allDayButton, "click", this.setAllDay.bind(this));
        Utility.on(this.submitButton, "click", this.saveScheduleInfo.bind(this));
        this.timeAlert.bind(this)();
        Utility.on(document, "click", this.clickCalendarCell.bind(this));
    },
    clickCalendarCell: function(event) {
        var target= event.target;
        if (target.tagName !== "TD" || target.className !== ""){
            return false;
        } else if (target.tagName === "TD" && target.className === "") {
            for (var i = 0; i < this.cell.length; i++) {
                var mouseX = event.clientX;
                var mouseY = event.clientY;
                var rect = this.cell[i].getBoundingClientRect();
                var width = this.cell[i].offsetWidth;
                var height = this.cell[i].offsetHeight;
                if ((mouseX > rect.left &&
                        mouseX < rect.left + width &&
                        mouseY > rect.top &&
                        mouseY < rect.top + height
                    )) {
                    this.cell[i].click(); // force click event
                    return true;
                }
            }
        }
    },
    timeAlert: function() {
        var elements = document.querySelectorAll(".timeInput");
        for (var i = 0; i < elements.length; i++) {
            Utility.on(elements[i], "focusout", this.compareDate.bind(this));
        }
    },
    compareDate: function() {
        var timeArray = this.getTime();
        var timeStart = this.dateFromISO(timeArray[0]);
        var timeEnd = this.dateFromISO(timeArray[1]);
        if ((timeStart - timeEnd) >= 0) {
            this.fixTime(event.target.id);
        }
    },
    fixTime: function(id) {
        if (id === 'startTime' || id === 'endTime') {
            this.endTimeInput.value = this.addMinutes(this.startTimeInput.value, '5');
        } else if (id === 'startDay' || id === 'endDay') {
            this.endDayInput.value = this.startDayInput.value;
        }
    },
    addMinutes: function(time, minsToAdd) {
        function D(J) {
            return (J < 10 ? '0' : '') + J;
        }
        var piece = time.split(':');
        var mins = piece[0] * 60 + +piece[1] + +minsToAdd;
        return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
    },
    dateFromISO: function(isostr) {
        var parts = isostr.match(/\d+/g);
        return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    },
    saveScheduleInfo: function(x) {
        var keyValue = this.setDayKey();
        var scheduleInfo = this.getScheduleInfo.bind(this)();
        if(scheduleInfo === undefined) return 0;    // 반복일정 기간이 잘못된 경우
        var alreadyHas = localStorage.getItem(keyValue);
        var scheduleArray = [];
        if (!!alreadyHas) {
            var parsedArray = JSON.parse(alreadyHas);
            parsedArray.push(scheduleInfo);
            localStorage.setItem(keyValue, JSON.stringify(parsedArray));
        } else {
            scheduleArray.push(scheduleInfo);
            localStorage.setItem(keyValue, JSON.stringify(scheduleArray));
        }
    },
    getScheduleInfo: function() {
        var scheduleInfo = {};
        for (var i = 0; i < this.inputIdList1.length; i++) {
            var inputValue = _$("#" + this.inputIdList1[i]).value;
            scheduleInfo[this.inputIdList1[i]] = inputValue;
        }
        var timeArray = this.getTime();
        scheduleInfo["start"] = timeArray[0];
        scheduleInfo["end"] = timeArray[1];
        if (this.allDayButton.checked) scheduleInfo["allDay"] = true;
        else scheduleInfo["allDay"] = false;
        var repeatValue = _$('input[name="optradio"]:checked').value;
        scheduleInfo['repeat'] = repeatValue;

        // check repeatEvent date
        var correntEvent = this.checkRepeatEvent(repeatValue, this.dateFromISO(scheduleInfo["start"]), this.dateFromISO(scheduleInfo["end"]));
        if(!correntEvent) scheduleInfo = undefined;

        return scheduleInfo;
    },
    getTime: function() {
        var timeArray = [];
        for (var j = 0; j < this.inputIdList2.length; j++) {
            var timeValue = "";
            for (var k = 0; k < this.inputIdList2[j].length; k++) {
                timeValue += _$("#" + this.inputIdList2[j][k]).value;
            }
            timeValue = timeValue.substr(0, 10) + 'T' + timeValue.substr(10);
            timeValue += ":00Z";
            timeArray.push(timeValue);
        }
        return timeArray;
    },
    setDayKey: function() {
        var startDay = this.startDayInput.value;
        var endDay = this.endDayInput.value;
        var keyValue = startDay + 'S' + endDay + 'E';
        return keyValue;
    },
    setAllDay: function() {
        var startTimeInput = this.startTimeInput;
        var endTimeInput = this.endTimeInput;
        if (this.allDayButton.checked) {
            this.defaultStart = startTimeInput.value;
            this.defaultEnd = endTimeInput.value;
            startTimeInput.value = "00:00";
            endTimeInput.value = "23:59";
            startTimeInput.readOnly = true;
            endTimeInput.readOnly = true;
            startTimeInput.style.backgroundColor = this.callbacklist["CHECK_COLOR"];
            endTimeInput.style.backgroundColor = this.callbacklist["CHECK_COLOR"];
        } else if (!this.allDayButton.checked) {
            startTimeInput.style.backgroundColor = this.callbacklist["NON_CHECK_COLOR"];
            endTimeInput.style.backgroundColor = this.callbacklist["NON_CHECK_COLOR"];
            startTimeInput.readOnly = false;
            endTimeInput.readOnly = false;
            startTimeInput.value = this.defaultStart;
            endTimeInput.value = this.defaultEnd;
        }
    },
    clearInput: function() {
        for (var i = 0; i < this.inputIdList1.length; i++) {
            _$("#" + this.inputIdList1[i]).value = "";
        }
        _$(".basicValue").checked = true;
        this.allDayButton.checked = false;
        this.startTimeInput.style.backgroundColor = this.callbacklist["NON_CHECK_COLOR"];
        this.endTimeInput.style.backgroundColor = this.callbacklist["NON_CHECK_COLOR"];
        this.defaultStart = "";
        this.defalutEnd = "";
    },
    /** 반복일정의 경우 기간 검사 */
    checkRepeatEvent: function(repeat, start, end) {
        var currDay = 24 * 60 * 60 * 1000;
        var currWeek = currDay * 7;
        var currMonth = currDay * 30;
        var currYear = currMonth * 12;
        var result = true;
        var diff = end - start;

        if(repeat === "D") {
            result = diff > currDay ? false : true;
        } else if(repeat === "W") {
            result = diff > currWeek ? false : true;
        } else if(repeat === "M") {
            result = diff > currMonth ? false : true;
        } else {
            result = diff > currYear ? false : true;
        }
        if(!result) alert("날짜 값이 잘못되었습니다.");
        return result;
    }
};
