function ScheduleDisplay() {
    this.scheduleArray;
    this.schedule;
    this.remainedSchedules;
    this.status;
}
ScheduleDisplay.prototype = {
    init: function(calendar, due, type) {
        //TODO:due와 type 이용해 일정 기간 스케쥴들 가져오는 함수 추가해야함
        // TODO: data.js에 저장해 둔 일정을 불러오는 형식으로 변경할 것.
        this.keys = [];
        this.calendarType = type;
        this.calendar = calendar;
        this.getThisMonthEvent(this.calendar.myDate);
        this.status = {
            isStart: true,
            isEnd: true,
            remain: 0,
            row: 0,
            key: "",
            position: 0
        };
        this.default = {
            monthHeight: 647,
            tableHeight: 107,
            milliToDay: 1000 * 60 * 60 * 24
        };
        this.moreRow = 3;
    },

    setEvents: function() {
        for (var i = 0; i < this.scheduleArray.length; i++) {
            var schedules = JSON.parse(this.scheduleArray[i]);
            this.status.key = this.keys[i];
            for (var j = 0; j < schedules.length; j++) {
                this.schedule = schedules[j];
                this.status.position = j;
                if (this.schedule.length === 0) continue; //빈 객체가 포함되어 있으면 이벤트출력 안함
                if (this.schedule.repeat !== "none") this.repeatEvent(this.schedule);
                else this.setMonthEvent(this.schedule);
            }
        }
    },
    setMonthEvent: function() {
        var start = Utility.setTimeByGMT(new Date(this.schedule.start));
        var end = Utility.setTimeByGMT(new Date(this.schedule.end));
        var startDate = Utility.formDate(start.getFullYear(), start.getMonth() + 1, start.getDate());
        var endDate = Utility.formDate(end.getFullYear(), end.getMonth() + 1, end.getDate());

        this.initStatus(this.status);
        var weeks = $(".fc-month-view .fc-day-grid .fc-row.fc-week");
        var dateHead = null;
        for (var i = 0; i < weeks.length; i++) {
            if (this.status.isStart) {
                dateHead = $(weeks[i]).find("." + Selector.scheduleSkeleton + " [data-date=\"" + startDate + "\"]");
            } else {
                dateHead = $(weeks[i]).find("." + Selector.scheduleSkeleton + " thead tr").children(0);
            }
            if(dateHead.length !== 0) {
              this.setWeekRowEvent(dateHead[0], weeks[i])
            }
            if (this.status.isEnd) {
                break;
            }
        }
    },
    setWeekRowEvent: function(dateHead, weekRow) {
      var rowBody = weekRow._$("." + Selector.scheduleSkeleton + " tbody");

      this.status.row = this.getEventRowCount(weekRow, dateHead);
      if (!this.status.isEnd) {
          for (var j = 0; j < this.status.row; j++) {
              if (rowBody.children.length <= this.status.row) {
              this.addRow(rowBody);
              }
          }
      }
      var dateBody = Utility.getTbodyFromThead(dateHead, this.status.row);

      if (this.status.row > this.moreRow) {
          this.setLimitedEvent(dateBody, this.schedule.title);
      }

      for (var day = 0; day < 7 && dateBody !== null && !this.status.isEnd; day++) {
          this.setEventBar(dateBody, this.schedule.title);
          dateBody = dateBody.nextElementSibling;
      }
    },
    initStatus: function(status) {
        var start = Utility.setTimeByGMT(new Date(this.schedule.start));
        var end = Utility.setTimeByGMT(new Date(this.schedule.end));
        var firstDate = Utility.setTimeByGMT(new Date(this.calendar.firstDay));
        Utility.setTimeDefault(start, 0);
        Utility.setTimeDefault(end, 0);

        if (start < firstDate) {
            status.remain = Math.ceil((end - firstDate) / this.default.milliToDay);
            status.isStart = false;
        } else {
            status.remain = Math.ceil((end - start) / this.default.milliToDay);
            status.isStart = true;
        }
        status.isEnd = false;
        status.row = 0;
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
        $(ele).addClass(Selector.schedule);
        ele.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">" +
            "<div class = \"fc-content\">" +
            "</div></a>";
        var eventLink = ele._$("a");

        var source = _$("#event-title-template").innerHTML;
        var template = Handlebars.compile(source);
        var titleData = {"title": title}
        var html = template(titleData);

        eventLink.setAttribute("data-key", this.status.key);
        eventLink.setAttribute("data-pos", this.status.position);

        if (ele.isEqualNode(ele.parentNode.firstElementChild) || this.status.isStart) {
            eventLink._$("div").innerHTML = html;
        }
        if (this.status.isStart) {
            $(eventLink).addClass("fc-start");
        } else {
            $(eventLink).addClass("fc-not-start");
        }
        this.setBarStatus(this.status);
        if (this.status.isEnd) {
            $(eventLink).addClass("fc-end");
        } else {
            $(eventLink).addClass("fc-not-end");;
        }
    },

    setLimitedEvent: function(ele, title) {
        $(ele.parentNode).addClass(Selector.limitEvent);
    },

    setMoreCell: function(ele) {
        $(ele).addClass( Selector.moreCell);
        ele.innerHTML = "<div><a class=\"" + Selector.moreButton + "\">more...</a></div>";

        $(ele._$("." + Selector.moreButton)).click(this.showMore.bind(this));
    },

    setHideCell: function(tableBody) {
        var newRow = tableBody.children[this.moreRow].cloneNode(true);
        newRow.innerHTML = newRow.innerHTML.replace(/more/g, "hide");
        var newCells = newRow.querySelectorAll("." + Selector.hideButton);

        for (var i = 0; i < newCells.length; i++) {
          $(newCells[i]).click(this.hideMore.bind(this));
          newCells[i].innerText = "hide";
        }

        var oldCell = tableBody._$("." + Selector.hideCell);

        if(oldCell !== null) {
          tableBody.replaceChild(newRow, oldCell.parentNode);
        } else {
          tableBody.appendChild(newRow);
        }
    },
    getThisMonthEvent: function(date) {
        this.scheduleArray = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var items = localStorage.getItem(key);
            var schedules = JSON.parse(items);
            var order = []; // 이번달에 표시할 이벤트
            var isRepeat = this.isRepeatEvent(key);

            if (isRepeat[0] || isRepeat[1].length > 0) order = isRepeat[1];
            if (order.length > 0) {
                var _schedules = [];
                for (var j = 0; j < schedules.length; j++) {
                    var schedule = schedules[j];
                    if (order.indexOf(j) !== -1) {
                        _schedules.push(JSON.stringify(schedule));
                    } else {
                        _schedules.push("{}");
                    }
                }
                this.scheduleArray.push("[" + _schedules + "]");
                this.keys.push(key);
                continue;
            }
            if(this.checkThisMonth(key)) {
                this.scheduleArray.push(items);
                this.keys.push(key);
            }
        }
        return this.scheduleArray;
    },
    isRepeatEvent: function(key) {
        var order = []; // 이번달에 표시할 이벤트
        var count = 0;
        var schedules = JSON.parse(localStorage.getItem(key));

        for (var i = 0; i < schedules.length; i++) {
            var schedule = schedules[i];
            var scheduleStart = schedule.start.slice(0, 10);
            if (schedule.repeat !== "none" && this.calendar.lastDay >= scheduleStart) {
                order.push(i);
                count++;
            } else {
                if(this.checkThisMonth(key)) order.push(i);
            }
        }
        if (count === schedules.length) return [true, order];
        else return [false, order];
    },
    checkThisMonth: function(key) {
        var result = true;
        var due = key.split("S");
        var eStart = due[0];
        var eEnd = due[1].replace("E", "");

        if ((eStart > this.calendar.lastDay && eEnd > this.calendar.lastDay)
        || eStart < this.calendar.firstDay && eEnd < this.calendar.firstDay) {
            result = false;
        }
        return result;
    },
    repeatEvent: function(event) {
        var repeatType = event.repeat;
        var nextStart = new Date(event.start);
        var nextEnd = new Date(event.end);

        this.findThisMonthEvent(nextStart, nextEnd, repeatType);

        var last = Utility.setTimeByGMT(new Date(this.calendar.lastDay));
        Utility.setTimeDefault(last, 9);
        while (last >= Utility.setTimeByGMT(nextStart)) {
            this.showRepeatEvent(event, nextStart, nextEnd);
            this.moveNextRepeatEvent(nextStart, nextEnd, repeatType);
        }
    },
    findThisMonthEvent: function(nextStart, nextEnd, repeatType) {
        var first = Utility.setTimeByGMT(new Date(this.calendar.firstDay));
        Utility.setTimeDefault(first, 0);

        while (first > nextEnd) {
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
        if (type === "D") {
            nextStart.setDate(nextStart.getDate() + 1);
            nextEnd.setDate(nextEnd.getDate() + 1);
        } else if (type === "W") {
            nextStart.setDate(nextStart.getDate() + 7);
            nextEnd.setDate(nextEnd.getDate() + 7);
        } else if (type === "M") {
            nextStart.setMonth(nextStart.getMonth() + 1);
            nextEnd.setMonth(nextEnd.getMonth() + 1);
        } else if (type === "Y") {
            nextStart.setFullYear(nextStart.getFullYear() + 1);
            nextEnd.setFullYear(nextEnd.getFullYear() + 1);
        }
    },
    addRow: function(bodyEle) {
        var newRow = bodyEle.firstElementChild.cloneNode(true);
        for (var i = 0; i < 7; i++) {
            newRow.children[i].innerHTML = "";
            newRow.children[i].className = "";
        }
        bodyEle.appendChild(newRow);
    },
    showMore: function(evt) {
        var moreButton = evt.target;
        var table = moreButton.parentNode.parentNode.parentNode.parentNode;
        var sidebar = document.querySelector("#sidebar");
        var mores = $(table).find("." + Selector.moreCell);
        var hidden = $(table).children();

        this.setHideCell(table);
        mores.hide();
        var cellHeight = ((table.children.length) * 20);
        table.closest(".fc-row").style.height = cellHeight + "px";
        sidebar.style.height = (722 + cellHeight - 107) + "px";
        _$("." + Selector.dayGridContainer).style.height = this.default.monthHeight + (cellHeight - this.default.tableHeight) + "px";

        hidden.removeClass(Selector.limitEvent);
    },
    hideMore: function(evt) {
        var hideButton = evt.target;
        var table = hideButton.parentNode.parentNode.parentNode.parentNode;
        var limited = $(table).children().slice(this.moreRow + 1);
        var mores = $(table).find("." + Selector.moreCell);

        mores.show();
        limited.addClass(Selector.limitEvent);

        var totalHeight = parseInt(_$("." + Selector.dayGridContainer).style.height);
        var cellHeight = parseInt(table.closest(".fc-row").style.height);
        table.closest(".fc-row").style.height = this.default.tableHeight + "px";
        sidebar.style.height = "";
        _$("." + Selector.dayGridContainer).style.height = totalHeight - (cellHeight - this.default.tableHeight) + "px";
    },
    getEventRowCount: function(row, dateHead) {
        var remain = this.status.remain;
        var count = 0;
        var result = 0;
        var trs = row.querySelectorAll("." + Selector.scheduleSkeleton + " tbody tr");

        if (remain > 7) {
            remain = 7;
        }

        for (var i = 0; i <= remain && dateHead !== null; i++) {
            for (var j = 0; j < trs.length; j++) {
                var toCheck = Utility.getTbodyFromThead(dateHead, count).classList;
                if(toCheck.contains(Selector.schedule)) {
                    count++;
                } if(count === this.moreRow) {
                    this.addRow(trs[0].parentNode)
                    this.setMoreCell(Utility.getTbodyFromThead(dateHead, count));
                    count++;
                }
            }

            if (count > result) {
                result = count;
            }
            dateHead = dateHead.nextElementSibling;
            count = 0;
        }
        return result;
    }
}
