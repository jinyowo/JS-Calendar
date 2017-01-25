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
}

ScheduleDisplay.prototype = {
  init: function() {
    this.scheduleObjects = JSON.parse(localStorage.getItem("2017-01-24"));
    this.schedule = this.scheduleObjects[0];
    this.setMonthEvent(this.schedule, 0);
  },

  setMonthEvent: function(event, eventRow) {
    var start = new Date(event.start);
    var end = new Date(event.end);



    var startDate = formDate(start.getFullYear(), start.getMonth()+1, start.getDate());
    var endDate = formDate(end.getFullYear(), end.getMonth()+1, end.getDate());
    var diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    var status = {
      isStart: true,
      isEnd: true,
      length: 0,
      diff: diff,
      hasNewLine: false
    };

    var weeks = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row.fc-week");
    var dateHead = null;
    var dateBody = null;
    for (var i = 0; i < weeks.length; i++) {
      if(!status.hasNewLine) {
        dateHead = weeks[i].querySelector(".fc-content-skeleton [data-date=\"" + startDate + "\"]");
        if(status.diff != 0) {
          var rowHead = weeks[i].querySelector(".fc-content-skeleton thead");
          dateBody = getTbodyFromThead(rowHead, dateHead);
        }
      } else {
        dateBody = weeks[i].querySelector(".fc-content-skeleton tbody tr").firstElementChild;
      }
      if (dateHead !== null && dateBody !== null) {
        var remain = status.diff - getElementPosition(dateBody) - 1;

        status = this.setBarStatus(status, remain);

        addClass(dateBody, "fc-event-container");
        if (status.length !== 1) {
          dateBody.setAttribute("colspan", status.length);

          for(var j = 0; j < status.length-1; j++) {
            var week = weeks[i].querySelectorAll(".fc-content-skeleton tbody tr");
            week[eventRow].removeChild(week[eventRow].lastElementChild);
          }
        }

        this.setEventBar(dateBody, event.title, status.isStart, status.isEnd)
      }
    }
  },

  setBarStatus: function(statusObj, remain) {
    statusObj.isStart = true;
    statusObj.isEnd = true;

    if(statusObj.hasNewLine === true) {
      statusObj.isStart = false;
    }

    if(remain > 0) {
      statusObj.hasNewLine = true;
      statusObj.isEnd = false;
    }

    if(statusObj.isEnd) {
      statusObj.length = statusObj.diff;
    } else if (statusObj.isStart) {
      statusObj.length = statusObj.diff - remain;
    } else if(!statusObj.isStart && !statusObj.isEnd) {
      statusObj.length = 7;
    }

    statusObj.diff -= statusObj.length;

    if(statusObj.diff === 0) {
      statusObj.isEnd = true;
      statusObj.hasNewLine = false;
    }
    return statusObj;
  },

  setEventBar: function(ele, title, isStart, isEnd) {
    ele.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">"
        + "<div class = \"fc-content\">"
        + "<span calss=\"fc-title\">" + title + "</span></div></a>";

    var eventLink = ele.querySelector("a");

    if(isStart) {
      addClass(eventLink,"fc-start");
    }
    else {
      addClass(eventLink,"fc-not-start");
    }
    if(isEnd) {
      addClass(eventLink,"fc-end");
    }
    else {
      addClass(eventLink,"fc-not-end");
    }
  }
}
