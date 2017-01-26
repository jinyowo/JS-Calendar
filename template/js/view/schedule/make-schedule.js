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
            this.getCurrentTime();
            this.makeEvent();
        }
    },
    makeEvent: function() {
        this.defaultStart = this.dateData + 'T' + this.Date1[0] + ':' + this.Date1[1];
        this.defaultEnd = this.dateData + 'T' + this.Date2[0] + ':' + this.Date2[1];
        this.submitInfo.startInput.value = this.defaultStart;
        this.submitInfo.endInput.value = this.defaultEnd;
        console.log(this.defaultStart);
        this.submitInfo.defaultStart = this.defaultStart;
        this.submitInfo.defaultEnd = this.defaultEnd;
        this.submitInfo.init();
    },
    getCurrentTime: function() {
        var date = new Date();
        var timedate1 = date.toTimeString();
        this.Date1 = timedate1.split(':', 3);
        date.setHours(date.getHours() + 1);
        var timedate2 = date.toTimeString();
        this.Date2 = timedate2.split(':', 3);
    },
    showInputForm: function() {
        Utility.showElement(this.container);
    },
    hideInputForm: function(event) {
        if (this.isTarget(event)) {
            Utility.hideElement(this.container);
            this.submitInfo.clearInput();
        }
    },
    isTarget: function(event) {
        var evtClass = event.target.className;
        var evtId = event.target.id;
        if (evtClass === "scheduleBackground" || evtClass === "closeButton" || evtId === "cancel") {
            return true;
        } else return false;
    }
};

function SubmitInfo() {
  this.allDayButton = _$('#allDay');
  this.submitButton = _$('#submit');
  this.inputIdList1 = ["title", "place", "desc"];
  this.inputIdList2 = ["start", "end"];
  this.startInput = _$("#start");
  this.endInput = _$("#end");
}
SubmitInfo.prototype = {
    init: function() {
        this.submitButton.addEventListener("click", this.saveScheduleInfo.bind(this));
        this.allDayButton.addEventListener("click", this.setAllDay.bind(this));
    },
    saveScheduleInfo: function() {
        this.setDayKey();
        var scheduleInfo=this.getScheduleInfo.bind(this)();
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

    },
    getScheduleInfo: function(){
      var scheduleInfo = {};
      for (var i = 0; i < this.inputIdList1.length; i++) {
          var inputValue = document.getElementById(this.inputIdList1[i]).value;
          scheduleInfo[this.inputIdList1[i]] = inputValue;
      }
      for (var j = 0; j < this.inputIdList2.length; j++) {
          var timeValue = document.getElementById(this.inputIdList2[j]).value;
          scheduleInfo[this.inputIdList2[j]] = timeValue + ":00Z";
      }
      if (this.allDayButton.checked) scheduleInfo["allDay"] = true;
      else scheduleInfo["allDay"] = false;
      var repeatValue = _$('input[name="optradio"]:checked').value;
      scheduleInfo['repeat'] = repeatValue;
      return scheduleInfo;
    },
    setDayKey: function() {
        var startTime = this.startInput.value;
        var startDay = startTime.split('T', 1);
        var endTime = this.endInput.value;
        var endDay = endTime.split('T', 1);
        this.keyValue = startDay + 'S' + endDay + 'E';
    },
    setAllDay: function() {
        if (!this.allDayButton.checked) {
            this.startInput.value = this.defaultStart;
            this.endInput.value = this.defaultEnd;
            return;
        } else if (this.allDayButton.checked) {
            var parsedDate1 = this.defaultStart.split('T', 1);
            var parsedDate2 = this.defaultEnd.split('T', 1);
            this.startInput.value = parsedDate1 + "T00:00";
            this.endInput.value = parsedDate2 + "T23:59";
        }
    },
    clearInput: function() {
        for (var i = 0; i < this.inputIdList1.length; i++) {
            document.getElementById(this.inputIdList1[i]).value = "";
        }
        _$(".basicValue").checked = true;
        this.allDayButton.checked = false;
    }
};
var showForm = new ShowFormPopup();
showForm.init();
