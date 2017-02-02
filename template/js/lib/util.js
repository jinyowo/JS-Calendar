var _$ = function(selector) {
  return document.querySelector(selector);
}

Element.prototype._$ = function(selector) {
  return this.querySelector(selector);
};

var _today = new Date();

var Utility = {
    // month이름, weekday이름, 각 달의 마지막 날짜를 저장한 배열
    months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    // var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // var weekdayClass = ["fc-sun", "fc-mon", "fc-tue", "fc-wed", "fc-thu", "fc-fri", "fc-sat"];
    // 오늘 년, 월, 일 정보를 저장할 object
    Today : {
        year : _today.getFullYear(),
        month : _today.getMonth(),
        date : _today.getDate(),
    },
    // 달력의 type 3가지를 저장할 object
    calendarType : {
        month : _$(".fc-month-view"),
        week : _$(".fc-basicWeek-view"),
        day : _$(".fc-agendaDay-view"),
    },
    buttonType : {
        arrow : "arrow",
        type : "type",
        today : "today",
    },

    padZero: function(number, length) {
        var result = number + '';
        while (result.length < length) {
            result = '0' + result;
        }
        return result;
    },
    formDate: function(year, month, date) {
        month = (month === 0) ? 12 : month;
        if (month > 12) {
            year += Math.floor(month / 12);
            month = month % 12;
        }
        return year + "-" + this.padZero(month, 2) + "-" + this.padZero(date, 2);
    },
    addClass: function(ele, name) {
        ele.classList.add(name);
    },
    removeClass: function(ele, name) {
        ele.classList.remove(name);
    },
    showElement: function(ele) {
        ele.style.display = "block";
    },
    hideElement: function(ele) {
        ele.style.display = "none";
    },
    inactiveButtonSet: function(buttons, className) {
        for(var i in buttons) {
            this.removeClass(buttons[i].ele, className);
        }
    },
    getTbodyFromThead: function(headEle, tdEle, row) {
        var tds = headEle.querySelectorAll("td");

        for (var i = 0; i < tds.length; i++) {
            if (tds[i].isEqualNode(tdEle)) {
                break;
            }
        }
        if (i < tds.length) {
            return headEle.nextElementSibling.children[row].children[i];
        } else {
            return null;
        }
    },
    getElementPosition: function(ele) {
        var i = 0;
        while (ele.nextElementSibling !== null) {
            i++;
            ele = ele.nextElementSibling;
        }
        return i;
    },

    resetEvent: function() {
        this.resetField();
        var eventRow = document.querySelectorAll(".fc-content-skeleton tbody");

        for (var i = 0; i < eventRow.length; i++) {
            eventRow[i].innerHTML = "<tr>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n<td></td>" +
                "\n</tr>";
        }
    },

    resetField: function() {
      var weekRow = document.querySelectorAll(".fc-month-view .fc-week");
      for (var i = 0; i < weekRow.length; i++) {
        weekRow[i].style.height = "107px"
      }

      _$(".fc-month-view .fc-scroller").style.height = "647px";
    },
    
    setTimeByGMT: function(date) {
      var converted = date;
      var offset = date.getTimezoneOffset()/60;
      var hours = date.getHours();

      converted.setHours(hours + offset);
      return converted;
    },

  setTimeDefault: function(date, type) {
      if(type === 0) {
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
      } else {
          date.setHours(23);
          date.setMinutes(59);
          date.setSeconds(59);
      }
  },
  on: function(target, evt, func ){ //evt는 문자열로 전달!!
      return target.addEventListener(evt, func);
  }
};
/** CSS class중 Selector로 주로 사용하는 class모음 */
var Selector = {
    monthView : "fc-month-view",
    // : "fc-content-skeleton",
    topDiv: "fc-toolbar",
    cellTop: "fc-day-top",
    cellBg: "fc-day",

    today : "fc-today",
    otherMonth : "fc-other-month",
    schedule : "fc-event-container",

    todayButton : "fc-today-button",
    monthTypeButton : "fc-month-button",
    weekTypeButton : "fc-agendaWeek-button",
    dayTypeButton : "fc-agendaDay-button",
    prevButton : "fc-prev-button",
    nextButton : "fc-next-button",
};
/** CSS class중 Style을 조정하는 class모음 */
var Style = {
    hoverEffect : "fc-state-hover",
    clickEffect : "fc-state-down",
    disabledEffect : "fc-state-disabled",
    activeEffect : "fc-state-active",
    todayEffect : "fc-state-highlight",
};
