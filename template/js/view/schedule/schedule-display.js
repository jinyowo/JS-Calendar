//temp data
localStorage.setItem("2017-01-24S2017-02-07E",JSON.stringify([{
  title: "일정",
  start: "2017-01-24T00:00:00Z",
  end: "2017-02-07T01:59:00Z",
  allDay: "false",
  repeat: "none",
  place: "where",
  desc: "dddddd"
}]));

function ScheduleDisplay() {
  this.scheduleObjects;
  this.schedule;
  this.remainedSchedules;
  this.status;
}

ScheduleDisplay.prototype = {
  init: function(type) {
    //TODO:type 이용해 일정 기간 스케쥴들 가져오는 함수 추가해야함
    this.scheduleObjects = [];
    this.getThisMonthEvent();
    this.status = {
      isStart: true,
      isEnd: true,
      length: 0,
      diff: 0,
      hasNewLine: false
    };
  },

  setEvents: function() {
    for(var i = 0; i < this.scheduleObjects.length; i++) {
      var schedules = JSON.parse(this.scheduleObjects[i])
      for (var j = 0; j < schedules.length; j++) {
        this.schedule = schedules[j];
        this.initStatus();
        this.setMonthEvent(this.schedule, 0);
      }
    }

    //TODO: 후에 여러개 등록 시 반복문 사용하여 모든 스케쥴 표시

  },

  setMonthEvent: function(event, eventRow) {
    var start = new Date(this.schedule.start);
    var startDate = Utility.formDate(start.getFullYear(), start.getMonth()+1, start.getDate());

    var weeks = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row.fc-week");
    var dateHead = null;
    var dateBody = null;
    for (var i = 0; i < weeks.length; i++) {
      if(!this.status.hasNewLine) {
        if (this.status.isStart) {
          dateHead = weeks[i]._$(".fc-content-skeleton [data-date=\"" + startDate + "\"]");
        } else {
          dateHead = weeks[i]._$(".fc-content-skeleton thead tr").firstElementChild;
        }
        if(this.status.diff !== 0) {
          var rowHead = weeks[i]._$(".fc-content-skeleton thead");
          dateBody = Utility.getTbodyFromThead(rowHead, dateHead);
        }
      } else {
        dataHead = weeks[i]._$(".fc-content-skeleton thead tr").firstElementChild;
        dateBody = weeks[i]._$(".fc-content-skeleton tbody tr").firstElementChild;
      }
      if (dateHead !== null && dateBody !== null) {
        var remain = this.status.diff - Utility.getElementPosition(dateBody) - 1;

        this.setBarStatus(remain,this.status);

        Utility.addClass(dateBody, "fc-event-container");
        if (this.status.length !== 1) {
          dateBody.setAttribute("colspan", this.status.length);

          for(var j = 0; j < this.status.length-1; j++) {
            var week = weeks[i].querySelectorAll(".fc-content-skeleton tbody tr");
            week[eventRow].removeChild(week[eventRow].lastElementChild);
          }
        }

        this.setEventBar(dateBody, event.title);
        if (this.status.isEnd === true) {
          break;
        }
      }
    }
  },

  setBarStatus: function(remain, status) {
    status.isEnd = true;
    if(status.hasNewLine === true) {
      status.isStart = false;
    }

    if(remain > 0) {
      status.hasNewLine = true;
      status.isEnd = false;
    }

    if(status.isEnd) {
      status.length = status.diff;
    } else if (status.isStart) {
      status.length = status.diff - remain;
    } else if(!status.isStart && !status.isEnd) {
      status.length = 7;
    }

    status.diff -= status.length;

    if(status.diff === 0) {
      status.isEnd = true;
      status.hasNewLine = false;
    }
  },

  setEventBar: function(ele, title) {
    ele.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">"
        + "<div class = \"fc-content\">"
        + "<span class=\"fc-title\">" + title + "</span></div></a>";

    var eventLink = ele._$("a");

    if(this.status.isStart) {
      Utility.addClass(eventLink,"fc-start");
    }
    else {
      Utility.addClass(eventLink,"fc-not-start");
    }
    if(this.status.isEnd) {
      Utility.addClass(eventLink,"fc-end");
    }
    else {
      Utility.addClass(eventLink,"fc-not-end");
    }
  },

  getThisMonthEvent: function() {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i)
      var due = key.split("S");
      var eStart = due[0];
      var eEnd = due[1].replace("E","");

      if (eEnd < this.getLastDate()) {
        if (eEnd > this.getFirstDate()) {
          this.scheduleObjects.push(localStorage.getItem(key));
        }
      } else if (eStart > this.getFirstDate()) {
        if (eStart < this.getLastDate()) {
          this.scheduleObjects.push(localStorage.getItem(key));
        }
      } else {
        this.scheduleObjects.push(localStorage.getItem(key));
      }
    }
  },

  getFirstDate: function() {
    return _$(".fc-day-top").getAttribute("data-date");
  },

  getLastDate: function() {
    return document.querySelectorAll(".fc-day-top")[41].getAttribute("data-date");
  },

  initStatus: function() {
    var start = new Date(this.schedule.start);
    var end = new Date(this.schedule.end);
    var firstDate = Date.parse(this.getFirstDate());

    if (start < firstDate) {
      this.status.diff = Math.ceil((end - firstDate) / (1000 * 60 * 60 * 24));
      this.status.isStart = false;
    } else {
      this.status.diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      this.status.isStart = true;
    }
    this.status.isEnd = true;
    this.status.length = 0;
    this.status.hasNewLine = false;
  }
}
