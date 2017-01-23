//temp data
localStorage.setItem("2017-01-24",JSON.stringify([{
  title: "일정",
  start: "2017-01-24T00:00:00Z",
  end: "2017-01-26T00:00:00Z",
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
  var diff = Math.round((end - start) / (1000 * 60 * 60 * 24));

  var weeks = document.querySelectorAll(".fc-day-grid .fc-row.fc-week");
  for (var i = 0; i < weeks.length; i++) {
    var dateHead = weeks[i].querySelector("[data-date=\"" + startDate + "\"]");
    if (dateHead !== null) {
      var rowHead = weeks[i].querySelector("thead");
      var dateBody = getTbodyFromThead(rowHead, dateHead);
      if (dateBody !== null) {
        dateBody.className += "fc-event-container";
        dateBody.setAttribute("colspan", diff);
        for(var j = 0; j < diff-1; j++) {
          var week = weeks[i].querySelectorAll(".fc-content-skeleton tbody tr");
          week[row].removeChild(week[row].lastElementChild);
        }
        dateBody.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable fc-resizable\">" +
          "<div class = \"fc-content\">"
          + "<span>" + event[row].title + "</span></div></a>";
      }
    }
    }
}
