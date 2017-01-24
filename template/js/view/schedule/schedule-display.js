//temp data
localStorage.setItem("2017-01-24",JSON.stringify([{
  title: "일정",
  start: "2017-01-24T00:00:00Z",
  end: "2017-02-07T23:59:00Z",
  allDay: "false",
  repeat: "none",
  place: "where",
  desc: "dddddd"
}]));

function ScheduleDisplay() {
  this.scheduleObjects = JSON.parse(localStorage.getItem(date));
  this.schedule;
  this.remainedSchedules;
}

ScheduleTeller.prototype = {
  init: function() {
    this.schedule = this.scheduleObjects[0];
    setEvent(this.schedule, 0);
  }

  setEvent: function(event, eventRow) {
    var start = new Date(event.start);
    var end = new Date(event.end);

    var startDate = formDate(start.getFullYear(), start.getMonth()+1, start.getDate());
    var endDate = formDate(end.getFullYear(), end.getMonth()+1, end.getDate());
    var diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    var status = {
      isStart: true,
      isEnd: true,
      length: 0;
      diff: diff;
      hasNewLine: false;

    }

    var weeks = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row.fc-week");
    for (var i = 0; i < weeks.length; i++) {
        var dateHead = null;
        var dateBody = null;
      if(!hasNewLine) {
        dateHead = weeks[i].querySelector(".fc-content-skeleton [data-date=\"" + startDate + "\"]");
        dateBody = this.setDateBody(dateHead);
      }
      if (dateHead !== null && dateBody !== null) {
          var remain = diff - getElementPosition(dateBody) - 1;

          addClass(dateBody, "fc-event-container");
          if (length !== 1) {
          dateBody.setAttribute("colspan", length);
            for(var j = 0; j < length-1; j++) {
              var week = weeks[i].querySelectorAll(".fc-content-skeleton tbody tr");
              week[eventRow].removeChild(week[eventRow].lastElementChild);
            }
          }
          this.setEventBar(dateBody, event.title, isStart, isEnd)
        }
      }
    }
  }

  setDateBody: function(dateHead) {
    var dateBody;
    if(diff != 0) {
      var rowHead = weeks[i].querySelector(".fc-content-skeleton thead");
      dateBody = getTbodyFromThead(rowHead, dateHead);
    } else {
    dateBody = weeks[i].querySelector(".fc-content-skeleton tbody tr").firstElementChild;
    }
    return dateBody;
  }

  setBarStatus: function(statusObj, remain) {
    if(hasNewLine === true) {
      statusObj.isStart = false;
    }
    if(remain > 0) {
      statusObj.hasNewLine = true;
      statusObj.isEnd = false;
    }
    if(isEnd) {
      statusObj.length = diff;
    } else if (isStart) {
      statusObj.length = diff - remain;
    } else if(!isStart && !isEnd) {
      statusObj.length = 7;
    }
    statusObj.diff -= statusObj.length;

    if(diff === 0) {
      statusObj.isEnd = true;
      statusObj.hasNewLine = false;
    }
    return statusObj;
  }

  setEventBar: function(ele, title, isStart, isEnd) {
    ele.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">" +
        "<div class = \"fc-content\">"
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
