//temp data
localStorage.setItem("2017-01-24",JSON.stringify([{
  title: "일정",
  start: "2017-01-24T00:00:00Z",
  end: "2017-02-07T23:59:00Z",
  allDay: "false",
  repeat: "none",
  place: "where",
  desc: "dddddd"
}]))

function setEvent(date) {
  var eventDate = JSON.parse(localStorage.getItem(date));
  setMonthEvent(eventDate, 0);
}

function setMonthEvent(event, row) {
  var start = new Date(event[row].start);
  var end = new Date(event[row].end);

  var startDate = formDate(start.getFullYear(), start.getMonth()+1, start.getDate());
  var endDate = formDate(end.getFullYear(), end.getMonth()+1, end.getDate());
  var diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  var hasNewLine = false;

  var weeks = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row.fc-week");
  for (var i = 0; i < weeks.length; i++) {
    if(!hasNewLine) {
      var dateHead = weeks[i].querySelector(".fc-content-skeleton [data-date=\"" + startDate + "\"]");
      var dateBody;
    }
    if (dateHead !== null) {
      if(!hasNewLine) {
        if(diff != 0) {
          var rowHead = weeks[i].querySelector(".fc-content-skeleton thead");
          dateBody = getTbodyFromThead(rowHead, dateHead);

        }
      } else {
        dateBody = weeks[i].querySelector(".fc-content-skeleton tbody tr").firstElementChild;
      }
        var remain = diff - getElementPosition(dateBody) - 1;
      if (dateBody !== null) {
        var isStart = true;
        var isEnd = true;
        var length = 0;

        if(hasNewLine === true) {
          isStart = false;
        }
        if(remain > 0) {
          hasNewLine = true;
          isEnd = false;
        }
        if(isEnd) {
          length = diff;
        } else if (isStart) {
          length = diff - remain;
        } else if(!isStart && !isEnd) {
          length = 7;
        }
          diff -= length;

          if(diff === 0) {
            isEnd = true;
            hasNewLine = false;
          }
          setEventClass(dateBody, isStart, isEnd, length, weeks[i], row, event[row].title);

      }
    }
  }
}

function setEventClass(dateBody, isStart, isEnd, length, week, row, title) {
  dateBody.className += "fc-event-container";
  if (length !== 1) {
    dateBody.setAttribute("colspan", length);
    for(var j = 0; j < length-1; j++) {
      var rowOfWeek = week.querySelectorAll(".fc-content-skeleton tbody tr");
      rowOfWeek[row].removeChild(rowOfWeek[row].lastElementChild);
    }
  }
  dateBody.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">" +
    "<div class = \"fc-content\">"
    + "<span calss=\"fc-title\">" + title + "</span></div></a>";
  var eventLink = dateBody.querySelector("a");
  if(isStart) {
    eventLink.className +=  " fc-start";
  }
  else {
    eventLink.className +=  " fc-not-start";
  }
  if(isEnd) {
    eventLink.className +=  " fc-end";
  }
  else {
    eventLink.className +=  " fc-not-end";
  }
}
