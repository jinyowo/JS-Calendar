function ScheduleDisplay() {
    this.scheduleObjects;
    this.schedule;
    this.remainedSchedules;
    this.status;
}
ScheduleDisplay.prototype = {

    init: function(calendar, due, type) {
      //TODO:due와 type 이용해 일정 기간 스케쥴들 가져오는 함수 추가해야함
      // TODO: data.js에 저장해 둔 일정을 불러오는 형식으로 변경할 것.
      this.scheduleObjects = [];
      this.keys = [];
      this.calendarType = type;
      this.calendar = calendar;
      this.getThisMonthEvent();
      this.status = {
          isStart: true,
          isEnd: true,
          remain: 0,
          row: 0,
          key: "",
          position: 0
      };
      this.initRow = 0;
    },

    setEvents: function() {
      for(var i = 0; i < this.scheduleObjects.length; i++) {
        var schedules = JSON.parse(this.scheduleObjects[i]);
        this.status.key = this.keys[i];
        for (var j = 0; j < schedules.length; j++) {
          this.schedule = schedules[j];
          this.status.position = j;
          if (this.schedule.repeat !== "none") {
            this.repeatEvent(this.schedule);
            this.initRow++;
          }
          else this.setMonthEvent(this.schedule);
        }
      }
      //TODO: 후에 여러개 등록 시 반복문 사용하여 모든 스케쥴 표시
    },
    setMonthEvent: function(event) {
        var start = Utility.setTimeByGMT(new Date(this.schedule.start));
        var end = Utility.setTimeByGMT(new Date(this.schedule.end));
        var startDate = Utility.formDate(start.getFullYear(), start.getMonth() + 1, start.getDate());
        var endDate = Utility.formDate(end.getFullYear(), end.getMonth() + 1, end.getDate());

        this.initStatus();
        var weeks = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row.fc-week");
        var dateHead = null;
        var dateBody = null;
        for (var i = 0; i < weeks.length; i++) {
            var rowHead = weeks[i]._$(".fc-content-skeleton thead");
            if (!this.status.isEnd) {
                for (var j = 0; j < this.status.row; j++) {
                    this.addRow(rowHead);
                }
            }
            if (this.status.isStart) {
                dateHead = weeks[i]._$(".fc-content-skeleton [data-date=\"" + startDate + "\"]");
            } else {
                dateHead = weeks[i]._$(".fc-content-skeleton thead tr").firstElementChild;
            }
            dateBody = Utility.getTbodyFromThead(rowHead, dateHead, this.status.row);

            if (dateHead !== null && dateBody !== null) {
                while (dateBody.classList.contains("fc-event-container")) {
                    this.status.row++;
                    this.addRow(rowHead);
                    dateBody = Utility.getTbodyFromThead(rowHead, dateHead, this.status.row);
                }
                for (var day = 0; day < 7 && dateBody !== null && this.status.isEnd !== true; day++) {
                    this.setEventBar(dateBody, event.title);
                    dateBody = dateBody.nextElementSibling;
                }
            }
            if (this.status.isEnd) {
                break;
            }
        }
    },

    initStatus: function() {
        var start = Utility.setTimeByGMT(new Date(this.schedule.start));
        var end = Utility.setTimeByGMT(new Date(this.schedule.end));
        var firstDate = Utility.setTimeByGMT(new Date(this.calendar.firstDay));
        Utility.setTimeDefault(start, 0);
        Utility.setTimeDefault(end, 0);

        if (start < firstDate) {
            this.status.remain = Math.ceil((end - firstDate) / (1000 * 60 * 60 * 24));
            this.status.isStart = false;
        } else {
            this.status.remain = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            this.status.isStart = true;
        }
        this.status.isEnd = false;
        this.status.row = this.initRow;
    },

    setBarStatus: function(status) {

        if (status.isStart) {
            status.isStart = false;
        }

        if (status.remain === 0) {
            status.isEnd = true;
        } else {
            status.remain--;
        }
    },

    setEventBar: function(ele, title) {
        Utility.addClass(ele, "fc-event-container");
        ele.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">" +
            "<div class = \"fc-content\">" +
            "</div></a>";
        var eventLink = ele._$("a");

        eventLink.setAttribute("data-key", this.status.key);
        eventLink.setAttribute("data-pos", this.status.position);

        if (ele.isEqualNode(ele.parentNode.firstElementChild) || this.status.isStart) {
            eventLink._$("div").innerHTML = "<span class = \"fc-title\">" + title + "</span>";
        }
        if (this.status.isStart) {
            Utility.addClass(eventLink, "fc-start");
        } else {
            Utility.addClass(eventLink, "fc-not-start");
        }
        this.setBarStatus(this.status);
        if (this.status.isEnd) {
            Utility.addClass(eventLink, "fc-end");
        } else {
            Utility.addClass(eventLink, "fc-not-end");
        }
    },

    getThisMonthEvent: function() {
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i)
            var due = key.split("S");
            var eStart = due[0];
            var eEnd = due[1].replace("E", "");

            if (eEnd < this.calendar.lastDay) {
                // 지난달과 이번달에 해당하는 repeatEvent를 받아온다
                if (this.isRepeatEvent(key)) {
                  continue;
                }
                if (eEnd > this.calendar.firstDay) {
                    this.scheduleObjects.push(localStorage.getItem(key));
                    this.keys.push(key);
                }
            } else if (eStart > this.calendar.firstDay) {
                if (eStart < this.calendar.lastDay) {
                    this.scheduleObjects.push(localStorage.getItem(key));
                    this.keys.push(key);
                }
            } else {
                this.scheduleObjects.push(localStorage.getItem(key));
                this.keys.push(key);
            }
        }
    },
    isRepeatEvent: function(key) {
        var schedules = JSON.parse(localStorage.getItem(key));
        for (var i = 0; i < schedules.length; i++) {
            var schedule = schedules[i];
            if (schedule.repeat !== "none") {
                this.scheduleObjects.push(localStorage.getItem(key));
                this.keys.push(key);
                return true;
            }
        }
        return false;
    },
    repeatEvent: function(event) {
        var repeatType = event.repeat;
        var nextStart = new Date(event.start);
        var nextEnd = new Date(event.end);

        this.findThisMonthEvent(nextStart, nextEnd, repeatType);

        var last = Utility.setTimeByGMT(new Date(this.calendar.lastDay));
        Utility.setTimeDefault(last, 9);
        while (last >= nextEnd) {
            this.showRepeatEvent(event, nextStart, nextEnd);
            this.moveNextRepeatEvent(nextStart, nextEnd, repeatType);
        }
    },
    findThisMonthEvent: function(nextStart, nextEnd, repeatType) {
       var first = Utility.setTimeByGMT(new Date(this.calendar.firstDay));
       Utility.setTimeDefault(first, 0);

       while (first >= nextStart) {
           this.moveNextRepeatEvent(nextStart, nextEnd, repeatType);
       }
   },
    showRepeatEvent: function(event, nextStart, nextEnd) {
        var repeatSchedule = event;
        repeatSchedule.start = nextStart;
        repeatSchedule.end = nextEnd;
        this.setMonthEvent(repeatSchedule, 0);
    },
    moveNextRepeatEvent: function(nextStart, nextEnd, type) {
        if(type === "D") {
            nextStart.setDate(nextStart.getDate() + 1);
            nextEnd.setDate(nextEnd.getDate() + 1);
        } else if(type === "W") {
            nextStart.setDate(nextStart.getDate() + 7);
            nextEnd.setDate(nextEnd.getDate() + 7);
        } else if(type === "M") {
            nextStart.setMonth(nextStart.getMonth() + 1);
            nextEnd.setMonth(nextEnd.getMonth() + 1);
        } else if(type === "Y") {
            nextStart.setFullYear(nextStart.getFullYear() + 1);
            nextEnd.setFullYear(nextEnd.getFullYear() + 1);
        }
    },
    addRow: function(headEle) {
        if (headEle.nextElementSibling.children.length <= this.status.row) {
          var newRow = headEle.nextElementSibling.firstElementChild.cloneNode(true);
          for (var i = 0; i < 7; i++) {
            newRow.children[i].innerHTML = "";
            newRow.children[i].className = "";
          }
          headEle.nextElementSibling.appendChild(newRow);
        }
    }
}
