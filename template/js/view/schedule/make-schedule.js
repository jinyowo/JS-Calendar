function ShowFormPopup() {
    this.div = document.querySelector('.fc-widget-content');
    this.container = document.querySelector('.scheduleBackground');
    this.closeButton = document.querySelector('.closeButton');

}
ShowFormPopup.prototype = {
    init: function() {
        this.div.addEventListener("click", this.getDateInfo.bind(this));
        document.addEventListener('click', this.hideInputForm.bind(this));
        this.getScheduleInfo = new submitInfo();
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
        document.getElementById("start").defaultValue = this.defaultStart;
        document.getElementById("end").defaultValue = this.defaultEnd;

        this.getScheduleInfo.defaultStart= this.defaultStart;
        this.getScheduleInfo.defaultEnd=this.defaultEnd;
        this.getScheduleInfo.init();
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
            this.getScheduleInfo.clearInput();
        }
    },
    isTarget: function(event) {
        if (event.target.className === "scheduleBackground" || event.target.className === "closeButton") {
            return true;
        } else return false;
    }
};

function submitInfo() {

    this.allDayButton = document.querySelector('#allDay');
    this.submitButton = document.querySelector('#submit');
    this.inputIdList1 = ["title", "place", "desc"];
    this.inputIdList2 = ["start", "end"];
    this.startInput = document.querySelector("#start");
    this.endInput = document.querySelector("#end");


}

submitInfo.prototype = {
    init: function() {
        this.submitButton.addEventListener("click", this.getScheduleInfo.bind(this));
        this.allDayButton.addEventListener("click", this.setAllDay.bind(this));

    },
    getScheduleInfo: function() {
        this.getDayKey();
        var scheduleArray = [];
        var scheduleInfo = {};
        var alreadyHas = localStorage.getItem(this.keyValue);

        for (var i = 0; i < this.inputIdList1.length; i++) {
            var inputValue = document.getElementById(this.inputIdList1[i]).value;
            scheduleInfo[this.inputIdList1[i]] = inputValue;
        }

        for (var j = 0; j < this.inputIdList2.length; j++) {
            var timeValue = document.getElementById(this.inputIdList2[j]).value;
            scheduleInfo[this.inputIdList2[j]] = timeValue + ":00Z";
        }
        if (this.allDayButton.checked) scheduleInfo["allDay"]=true;
        else  scheduleInfo["allDay"]=false;

        var repeatValue = document.querySelector('input[name="optradio"]:checked').value;
        scheduleInfo['repeat'] = repeatValue;
        if (!!alreadyHas) {
            var parsedArray = JSON.parse(alreadyHas);
            parsedArray.push(scheduleInfo);
            localStorage.setItem(this.keyValue, JSON.stringify(parsedArray));
        } else {
            scheduleArray.push(scheduleInfo);
            localStorage.setItem(this.keyValue, JSON.stringify(scheduleArray));
        }

    },
    getDayKey: function() {
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
        }
        var parsedDate1 = this.defaultStart.split('T', 1);
        var parsedDate2 = this.defaultEnd.split('T', 1);
        this.startInput.value = parsedDate1 + "T00:00";
        this.endInput.value = parsedDate2 + "T23:59";
    },
    clearInput: function(){
      for (var i = 0; i < this.inputIdList1.length; i++) {
          document.getElementById(this.inputIdList1[i]).value = "";
      }
      document.querySelector(".basicValue").checked = true;
      this.allDayButton.checked = false;
    }
};
var showForm = new ShowFormPopup();

showForm.init();
