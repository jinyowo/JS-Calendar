//temp data
//localstorage 객체는 여기저기서 사용하는거 같은데, localstorage 클래스를 하나 만들고 같이 사용하는게 어때요? 
localStorage.setItem("2017-01-24S2017-02-07E",JSON.stringify([{
  title: "일정",
  start: "2017-01-24T00:00:00Z",
  end: "2017-01-29T01:59:00Z",
  allDay: "false",
  repeat: "none",
  place: "where",
  desc: "dddddd"
}]));
localStorage.setItem("2016-12-06S2016-12-08E", JSON.stringify([{
    title: "일정",
    start: "2016-12-06T00:00:00Z",
    end: "2016-12-08T02:59:00Z",
    allDay: "false",
    repeat: "W",
    place: "where",
    desc: "dddddd"
}]));

function ScheduleDisplay() {
    //변수의 초기값을 설정해주는 게 좋아요.
    this.scheduleObjects;
    this.schedule;
    this.remainedSchedules;
    this.status;
}

ScheduleDisplay.prototype = {
  init: function(calendar, due, type) {
    //TODO:due와 type 이용해 일정 기간 스케쥴들 가져오는 함수 추가해야함
    // TODO: data.js에 저장해 둔 일정을 불러오는 형식으로 변경할 것.
    //배열인데 이름은 objects..
    this.scheduleObjects = [];
    this.calendarType = type;
    this.calendar = calendar;
    this.getThisMonthEvent();
    // status 값 관리가 필요해서, 전체로직이 복잡해보이는데 그렇지 않나요? 개선할 필요 없을지 살펴보세요.
    this.status = {
        isStart: true,
        isEnd: true,
        remain: 0
    };
  },

  setEvents: function() {
    for(var i = 0; i < this.scheduleObjects.length; i++) {
      var schedules = JSON.parse(this.scheduleObjects[i])
      //중첩되지 않은 for문을 사용할 수 있으면 더 좋을 듯.
      for (var j = 0; j < schedules.length; j++) {
        this.schedule = schedules[j];
        if (this.schedule.repeat !== "none") this.repeatEvent(this.schedule);
        this.setMonthEvent(this.schedule, 0);
      }
    }
    //TODO: 후에 여러개 등록 시 반복문 사용하여 모든 스케쥴 표시
  },

  setMonthEvent: function(event, eventRow) {
      var start = Utility.setTimeByGMT(new Date(this.schedule.start));
      var startDate = Utility.formDate(start.getFullYear(), start.getMonth()+1, start.getDate());

      //for - if - for 문으로 중첩된 코드를 개선해보시죠.
      this.initStatus();
      var weeks = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row.fc-week");
      var dateHead = null;
      var dateBody = null;
      for (var i = 0; i < weeks.length; i++) {
        if (this.status.isStart) {
          //다른코드에서 적어놨지만 css class이름은 어딘가 몰아서 정리하세요.
          dateHead = weeks[i]._$(".fc-content-skeleton [data-date=\"" + startDate + "\"]");
        } else {
          dateHead = weeks[i]._$(".fc-content-skeleton thead tr").firstElementChild;
        }
        var rowHead = weeks[i]._$(".fc-content-skeleton thead");
        dateBody = Utility.getTbodyFromThead(rowHead, dateHead);


        if (dateHead !== null && dateBody !== null) {
          //조건이 좀 복잡하네요. dateBody는 바로 위에서 이미 체크한거 같은데 for문에서 루프를 돌면서 매번 체크해야 하나요?
          for (var day = 0; day < 7 && dateBody !== null && this.status.isEnd !== true; day++) {
            //이 함수의 반환값을 만들어서 결과에 따라서 break를 하던지 하는 것도 필요해보입니다.
            this.setEventBar(dateBody, event.title);

            dateBody = dateBody.nextElementSibling;
          }
        }
        //이 코드는 if(this.status.isEnd) 라고만 해도 동일.
          if (this.status.isEnd === true) {
            break;
          }
      }
  },

    initStatus: function() {
      var start = Utility.setTimeByGMT(new Date(this.schedule.start));
      var end = Utility.setTimeByGMT(new Date(this.schedule.end));
      var firstDate = Date.parse(this.calendar.firstDay);

      if (start < firstDate) {
        //뒷부분의 1000*60*60*24는 if문과 상관없이 계산해야함으로 분기문에서 빼시죠. 
        this.status.remain = Math.ceil((end - firstDate) / (1000 * 60 * 60 * 24));
        this.status.isStart = false;
      } else {
        this.status.remain = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        this.status.isStart = true;
      }
      this.status.isEnd = false;
    },

    setBarStatus: function(status) {

      if(status.isStart) {
        status.isStart = false;
      }

      status.remain --;

      if(status.remain === 0) {
        status.isEnd = true;
      }
    },

  setEventBar: function(ele, title) {
    Utility.addClass(ele, "fc-event-container");
    //handlebar 사용하세요~
    ele.innerHTML = "<a class = \"fc-day-grid-event fc-h-event fc-event fc-draggable fc-resizable\">"
        + "<div class = \"fc-content\">"
        +"</div></a>";
    var eventLink = ele._$("a");

    if (ele.isEqualNode(ele.parentNode.firstElementChild) || this.status.isStart) {
      eventLink._$("div").innerHTML = "<span class = \"fc-title\">" + title + "</span>";
    }
    if(this.status.isStart) {
      Utility.addClass(eventLink,"fc-start");
    }
    else {
      Utility.addClass(eventLink,"fc-not-start");
    }
    this.setBarStatus(this.status);
    if(this.status.isEnd) {
      Utility.addClass(eventLink,"fc-end");
    }
    else {
      Utility.addClass(eventLink,"fc-not-end");
    }
  },

  getThisMonthEvent: function() {
    //localStorage 의 length를 먼저체크하고, 없으면 먼저 반환하고, 그렇지 않다면 for문을 돌리는게 좋을 듯.
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i)
      var due = key.split("S");
      var eStart = due[0];
      var eEnd = due[1].replace("E","");

      //이함수는 기억했다가 test code로 아래 조건들 모두와 조건에 벗어나는경우의 테스트코드를 구현해보시고, 문제 없는 로직인지 판단하세요.
      if (eEnd < this.calendar.lastDay) {
        if (eEnd > this.calendar.firstDay) {
          this.scheduleObjects.push(localStorage.getItem(key));
        }
      } else if (eStart > this.calendar.firstDay) {
        if (eStart < this.calendar.lastDay) {
          this.scheduleObjects.push(localStorage.getItem(key));
        }
      } else {
        this.scheduleObjects.push(localStorage.getItem(key));
      }
    }
  },

  //이 함수는 여러번 불리면 안될것처럼 생겼네요. 혹시 자주 불리는 함수이면 로직을 개선해야겠어요. 너무 많은 계산을 자주 할 수 있어보임.
  repeatEvent: function(event) {
    var repeatCycle = 0;
    //이걸 switch로 하지말고 static데이터로 오브젝트에 담아두는게 더 좋을거 같은데 비교해보세요.
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
    var nextStart = Utility.setTimeByGMT(new Date(event.start));
    var nextEnd = Utility.setTimeByGMT(new Date(event.end));
    var first = Utility.setTimeByGMT(new Date(this.calendar.firstDay));
    var last = Utility.setTimeByGMT(new Date(this.calendar.lastDay));
    //아래 6줄은 어디 함수에서 처리하도록 하고, 그 함수를 여기서 호출하면 좋을 듯.
    first.setHours(0);
    first.setMinutes(0);
    first.setSeconds(0);
    last.setHours(23);
    last.setMinutes(59);
    last.setSeconds(59);
    //10의 의미하는게 뭔지모르겠어요. 뭔가 중요한거 같은데 코드에서 의도가 느러나지 않음.
    //if 문들이 모두 while을 두번쓰고 중복코드가 많이 보이네요. 이걸 해결하려고 노력해보세요.
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
