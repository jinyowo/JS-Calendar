function ShowFormPopup() {
    this.calendarCell = _$('.fc-widget-content');
    this.container = _$('.scheduleBackground');
    this.submitInfo = new SubmitInfo();
}
ShowFormPopup.prototype = {
    init: function() {
        this.calendarCell.addEventListener("click", this.getDateInfo.bind(this));
        document.addEventListener('click', this.hideInputForm.bind(this));
    },
    getDateInfo: function() {
        this.dateData = event.target.getAttribute("data-date");
        if (event.target.className === "fc-day-number") {
            this.dateData = event.target.parentNode.getAttribute("data-date");
        }
        if (!!this.dateData) {
            this.showInputForm();
            // this.getCurrentTime()
            this.makeEvent();
            this.compareTime.bind(this)();
        }
    },
    compareTime: function() {
        var time = _$("#startTime").value;
        var a = time.split(':');
        var ts = ((a[0] * 60) * 60) + (a[1] * 60); // 현재시간을 초로 변환

        console.log(ts);

        if (ts >= 82800) { // 원하는 시간을 초로 바꿔서 현재시간을 초로 변환한 값과 비교
            var parsedDate = this.dateData.split("-", 3);
            var day = parseInt(parsedDate[2]) + 1;
            _$("#endDay").value = parsedDate[0] + "-" + parsedDate[1] + "-" + day;
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

        console.log(StartDay);
        console.log(StartTime);
        // this.submitInfo.defaultStartDay = StartDay;
        // this.submitInfo.defaultStartTime = StartTime;
        // this.submitInfo.defaultEndDay = EndDay;
        // this.submitInfo.defaultEndTime = EndTime;
        //this.submitInfo.init();
    },
    getCurrentTime: function() {
        var date = new Date();
        // date.setHours(23);
        // date.setMinutes(0);
        var timedate1 = date.toTimeString();
        this.Date1 = timedate1.split(':', 2);
        date.setHours(date.getHours() + 1);
        var timedate2 = date.toTimeString();
        this.Date2 = timedate2.split(':', 2);
    },
    showInputForm: function() {
        Utility.showElement(this.container);
    },
    hideInputForm: function(event) {
        if (this.isTarget(event.target)) {
            Utility.hideElement(this.container);
            this.submitInfo.clearInput();
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

function SubmitInfo() {
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
}
SubmitInfo.prototype = {
    init: function() {
        this.allDayButton.addEventListener("click", this.setAllDay.bind(this));
        this.submitButton.addEventListener("click", this.saveScheduleInfo.bind(this)); //,testPosition));
        this.timeAlert.bind(this)();
    },
    timeAlert: function() {
        var elements = document.querySelectorAll(".timeInput");
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener("focusout", this.compareDate.bind(this));
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
            _$('#endTime').value = this.addMinutes(_$('#startTime').value, '5');
        } else if (id === 'startDay' || id === 'endDay') {
            _$("#endDay").value = _$('#startDay').value;
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
        console.log(x);
        if (typeof x === 'number') {
            console.log(x);
            this.getInputValue.bind(this, 0)();
        } else if (typeof x !== 'number') {
            this.setDayKey();
            var scheduleInfo = this.getScheduleInfo.bind(this)();
            if(scheduleInfo === undefined) return 0;
            var alreadyHas = localStorage.getItem(this.keyValue);
            var scheduleArray = [];
            if (!!alreadyHas) {
                var parsedArray = JSON.parse(alreadyHas);
                parsedArray.push(scheduleInfo);
                localStorage.setItem(this.keyValue, JSON.stringify(parsedArray));
            } else {
                scheduleArray.push(scheduleInfo);
                localStorage.setItem(this.keyValue, JSON.stringify(scheduleArray));
            }
        }
    },
    getInputValue: function(position) {
        var scheduleInfo = this.getScheduleInfo.bind(this)();
        console.log(scheduleInfo); // 테스트용
        var alreadyHas = localStorage.getItem("2017-01-04S2017-01-04E");
        var parsedArray = JSON.parse(alreadyHas);
        parsedArray.splice(position, 1, scheduleInfo);
        localStorage.setItem("2017-01-04S2017-01-04E", JSON.stringify(parsedArray));

        //테스트용 출력
        var test = localStorage.getItem("2017-01-04S2017-01-04E");
        console.log(test);
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
        var form = document.getElementById("schedule");
        form.onsubmit = this.checkRepeatEvent(repeatValue, this.dateFromISO(scheduleInfo["start"]), this.dateFromISO(scheduleInfo["end"]));

        scheduleInfo['repeat'] = repeatValue;
        if(!form.onsubmit) {
            scheduleInfo = undefined;
        }
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
            console.log(timeValue);
            timeArray.push(timeValue);
        }
        return timeArray;
    },
    setDayKey: function() {
        var startDay = this.startDayInput.value;
        var endDay = this.endDayInput.value;
        this.keyValue = startDay + 'S' + endDay + 'E';
    },
    setAllDay: function() {
        //this.getCurrentTime();
        var startTimeInput = this.startTimeInput;
        var endTimeInput = this.endTimeInput;
        if (this.allDayButton.checked) {
            this.defaultStart = startTimeInput.value;
            this.defaultEnd = endTimeInput.value;
            startTimeInput.value = "00:00";
            endTimeInput.value = "23:59";
            startTimeInput.readOnly = true;
            endTimeInput.readOnly = true;
            startTimeInput.style.backgroundColor = "LightGray";
            endTimeInput.style.backgroundColor = "LightGray";
        } else if (!this.allDayButton.checked) {
            startTimeInput.style.backgroundColor = "White";
            endTimeInput.style.backgroundColor = "White";
            startTimeInput.readOnly = false;
            endTimeInput.readOnly = false;
            startTimeInput.value = this.defaultStart; //this.Date1[0] + ':' + this.Date1[1];
            endTimeInput.value = this.defaultEnd; //this.Date2[0] + ':' + this.Date2[1];
        }
    },
    clearInput: function() {
        for (var i = 0; i < this.inputIdList1.length; i++) {
            _$("#" + this.inputIdList1[i]).value = "";
        }
        _$(".basicValue").checked = true;
        this.allDayButton.checked = false;
        this.startTimeInput.style.backgroundColor = "White";
        this.endTimeInput.style.backgroundColor = "White";
        this.defaultStart = "";
        this.defalutEnd = "";
    },
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
            result = diff > currWeek > 7 ? false : true;
        } else if(repeat === "M") {
            result = diff > currMonth ? false : true;
        } else {
            result = diff > currYear ? false : true;
        }
        if(!result) alert("날짜 값이 잘못되었습니다.");
        return result;
    }
};
var showForm = new ShowFormPopup();
showForm.init();
