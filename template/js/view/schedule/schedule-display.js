//temp data
localStorage.setItem("2017-01-24",JSON.stringify([{
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
  init: function(due, type) {
    //TODO:due와 type 이용해 일정 기간 스케쥴들 가져오는 함수 추가해야함
    this.scheduleObjects = JSON.parse(localStorage.getItem("2017-01-24"));
    this.schedule = this.scheduleObjects[0];
    this.status = {
      isStart: true,
      isEnd: true,
      length: 0,
      diff: 0,
      hasNewLine: false
    };
  },

  setEvents: function() {
    //TODO: 후에 여러개 등록 시 반복문 사용하여 모든 스케쥴 표시
    this.setMonthEvent(this.schedule, 0);
  },

  setMonthEvent: function(event, eventRow) {
    var start = new Date(event.start);
    var end = new Date(event.end);

    var startDate = Utility.formDate(start.getFullYear(), start.getMonth()+1, start.getDate());
    this.status.diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    var weeks = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row.fc-week");
    var dateHead = null;
    var dateBody = null;
    for (var i = 0; i < weeks.length; i++) {
      if(!this.status.hasNewLine) {
        dateHead = weeks[i].querySelector(".fc-content-skeleton [data-date=\"" + startDate + "\"]");
        if(this.status.diff !== 0) {
          var rowHead = weeks[i].querySelector(".fc-content-skeleton thead");
          dateBody = Utility.getTbodyFromThead(rowHead, dateHead);
        }
      } else {
        dateBody = weeks[i].querySelector(".fc-content-skeleton tbody tr").firstElementChild;
      }
      if (dateHead !== null && dateBody !== null) {
        var remain = this.status.diff - Utility.getElementPosition(dateBody) - 1;

        this.setBarStatus(remain);

        Utility.addClass(dateBody, "fc-event-container");
        if (this.status.length !== 1) {
          dateBody.setAttribute("colspan", this.status.length);

          for(var j = 0; j < this.status.length-1; j++) {
            var week = weeks[i].querySelectorAll(".fc-content-skeleton tbody tr");
            week[eventRow].removeChild(week[eventRow].lastElementChild);
          }
        }

        this.setEventBar(dateBody, event.title, this.status.isStart, this.status.isEnd)
      }
    }
  },

  setBarStatus: function(remain) {
    this.status.isStart = true;
    this.status.isEnd = true;

    if(this.status.hasNewLine === true) {
      this.status.isStart = false;
    }

    if(remain > 0) {
      this.status.hasNewLine = true;
      this.status.isEnd = false;
    }

    if(this.status.isEnd) {
      this.status.length = this.status.diff;
    } else if (this.status.isStart) {
      this.status.length = this.status.diff - remain;
    } else if(!this.status.isStart && !this.status.isEnd) {
      this.status.length = 7;
    }

    this.status.diff -= this.status.length;

    if(this.status.diff === 0) {
      this.status.isEnd = true;
      this.status.hasNewLine = false;
    }
    return this.status;
  },

  setEventBar: function(ele, title) {
    ele.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">"
        + "<div class = \"fc-content\">"
        + "<span calss=\"fc-title\">" + title + "</span></div></a>";

    var eventLink = ele.querySelector("a");

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
  }
}
