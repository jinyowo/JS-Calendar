//temp data
localStorage.setItem("2017-01-24", JSON.stringify([{
    title: "일정",
    start: "2016-12-03T00:00:00Z",
    end: "2016-12-05T02:59:00Z",
    allDay: "false",
    repeat: "Y",
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
    init: function(calendar, due, type) {
        //TODO:due와 type 이용해 일정 기간 스케쥴들 가져오는 함수 추가해야함
        // TODO: data.js에 저장해 둔 일정을 불러오는 형식으로 변경할 것.
        this.scheduleObjects = JSON.parse(localStorage.getItem("2017-01-24"));
        this.schedule = this.scheduleObjects[0];
        this.status = {
            isStart: true,
            isEnd: true,
            length: 0,
            diff: 0,
            hasNewLine: false
        };
        this.calendarType = type;
        this.calendar = calendar;
    },

    setEvents: function() {
        //TODO: 후에 여러개 등록 시 반복문 사용하여 모든 스케쥴 표시
        if (this.schedule.repeat !== "none") this.repeatEvent(this.schedule);
        else this.setMonthEvent(this.schedule, 0);
    },

    setMonthEvent: function(event, eventRow) {
        var start = new Date(event.start);
        var end = new Date(event.end);

        var startDate = Utility.formDate(start.getFullYear(), start.getMonth() + 1, start.getDate());
        this.status.diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        var weeks = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row.fc-week");
        var dateHead = null;
        var dateBody = null;
        for (var i = 0; i < weeks.length; i++) {
            if (!this.status.hasNewLine) {
                dateHead = weeks[i].querySelector(".fc-content-skeleton [data-date=\"" + startDate + "\"]");
                if (this.status.diff !== 0) {
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

                    for (var j = 0; j < this.status.length - 1; j++) {
                        var week = weeks[i].querySelectorAll(".fc-content-skeleton tbody tr");
                        week[eventRow].removeChild(week[eventRow].lastElementChild);
                    }
                }

                this.setEventBar(dateBody, event.title, this.status.isStart, this.status.isEnd);

            }
        }
    },
    setBarStatus: function(remain) {
        this.status.isStart = true;
        this.status.isEnd = true;

        if (this.status.hasNewLine === true) {
            this.status.isStart = false;
        }

        if (remain > 0) {
            this.status.hasNewLine = true;
            this.status.isEnd = false;
        }

        if (this.status.isEnd) {
            this.status.length = this.status.diff;
        } else if (this.status.isStart) {
            this.status.length = this.status.diff - remain;
        } else if (!this.status.isStart && !this.status.isEnd) {
            this.status.length = 7;
        }

        this.status.diff -= this.status.length;

        if (this.status.diff === 0) {
            this.status.isEnd = true;
            this.status.hasNewLine = false;
        }
        return this.status;
    },

    setEventBar: function(ele, title) {
        ele.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">" +
            "<div class = \"fc-content\">" +
            "<span calss=\"fc-title\">" + title + "</span></div></a>";

        var eventLink = ele.querySelector("a");

        if (this.status.isStart) {
            Utility.addClass(eventLink, "fc-start");
        } else {
            Utility.addClass(eventLink, "fc-not-start");
        }
        if (this.status.isEnd) {
            Utility.addClass(eventLink, "fc-end");
        } else {
            Utility.addClass(eventLink, "fc-not-end");
        }
    },
    repeatEvent: function(event) {
        var repeatCycle = 0;
        switch (event.repeat) {
            case "Y":
                repeatCycle = 365;
                break;
            case "M":
                repeatCycle = 30;
                break;
            case "W":
                repeatCycle = 7;
                break;
            case "D":
                repeatCycle = 1;
                break;
        }
        var nextStart = new Date(event.start);
        var nextEnd = new Date(event.end);
        var first = new Date(this.calendar.firstDay);
        var last = new Date(this.calendar.lastDay);
        first.setHours(0);
        first.setMinutes(0);
        first.setSeconds(0);
        last.setHours(23);
        last.setMinutes(59);
        last.setSeconds(59);
        if (repeatCycle < 10) {
            while (first >= nextStart) {
                nextStart.setDate(nextStart.getDate() + repeatCycle);
                nextEnd.setDate(nextEnd.getDate() + repeatCycle);
            }
            while (last >= nextEnd) {
                var repeatSchedule = event;
                repeatSchedule.start = nextStart;
                repeatSchedule.end = nextEnd;
                this.setMonthEvent(repeatSchedule, 0);

                nextStart.setDate(nextStart.getDate() + repeatCycle);
                nextEnd.setDate(nextEnd.getDate() + repeatCycle);
            }
        } else if (repeatCycle === 30) {
            while (first >= nextStart) {
                nextStart.setMonth(nextStart.getMonth() + 1);
                nextEnd.setMonth(nextEnd.getMonth() + 1);
            }
            while (last >= nextEnd) {
                var repeatSchedule = event;
                repeatSchedule.start = nextStart;
                repeatSchedule.end = nextEnd;
                this.setMonthEvent(repeatSchedule, 0);

                nextStart.setMonth(nextStart.getMonth() + 1);
                nextEnd.setMonth(nextEnd.getMonth() + 1);
            }
        } else {
            while (first >= nextStart) {
                nextStart.setFullYear(nextStart.getFullYear() + 1);
                nextEnd.setFullYear(nextEnd.getFullYear() + 1);
            }
            while (last >= nextEnd) {
                var repeatSchedule = event;
                repeatSchedule.start = nextStart;
                repeatSchedule.end = nextEnd;
                this.setMonthEvent(repeatSchedule, 0);

                nextStart.setFullYear(nextStart.getFullYear() + 1);
                nextEnd.setFullYear(nextEnd.getFullYear() + 1);
            }
        }
    },
}
