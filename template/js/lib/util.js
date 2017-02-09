/** CSS class중 Selector로 주로 사용하는 class모음 */
var Selector = {
    monthView : 'fc-month-view',
    weekView : 'fc-basicWeek-view',
    dayView : 'fc-agendaDay-view',
    dayGridContainer : 'fc-day-grid-container',
    topDiv: 'fc-toolbar',
    title: 'fc-center',
    cellTop: 'fc-month-view .fc-day-top',
    cellBg: 'fc-month-view .fc-day',

    today : 'fc-today',
    otherMonth : 'fc-other-month',
    scheduleSkeleton : 'fc-content-skeleton',
    schedule : 'fc-event-container',

    todayButton : 'fc-today-button',
    monthTypeButton : 'fc-month-button',
    weekTypeButton : 'fc-agendaWeek-button',
    dayTypeButton : 'fc-agendaDay-button',
    prevButton : 'fc-prev-button',
    nextButton : 'fc-next-button',

    moreCell : 'fc-more-cell',
    moreButton : 'fc-more',
    hideCell : 'fc-hide-cell',
    hideButton : 'fc-hide',

    limitEvent : 'fc-limited',

    Mtoday : 'mini-today',
    Mtitle : 'mini-title',
    Mcells : 'mini-cells',
    Mselected : 'mini-selected',
    Mevent : 'mini-event',
    MotherMonth : 'mini-other-month',
    MprevButton : 'mini-prev-button',
    MnextButton : 'mini-next-button',

};
/** CSS class중 Style을 조정하는 class모음 */
var Style = {
    hoverEffect : 'fc-state-hover',
    clickEffect : 'fc-state-down',
    disabledEffect : 'fc-state-disabled',
    activeEffect : 'fc-state-active',
    todayEffect : 'fc-state-highlight',
};
/** 자료 저장을 위해 만든 custom attribute모음 */
var CustomData = {
    date: 'data-date',
};
var _$ = function(selector) {
  return document.querySelector(selector);
};

Element.prototype._$ = function(selector) {
  return this.querySelector(selector);
};

var _today = new Date();

var Utility = {
    // month이름, weekday이름, 각 달의 마지막 날짜를 저장한 배열
    months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    // 오늘 년, 월, 일 정보를 저장할 object
    Today : {
        year : _today.getFullYear(),
        month : _today.getMonth(),
        date : _today.getDate(),
    },
    // 달력의 type 3가지를 저장할 object
    calendarType : {
        month : '.'+Selector.monthView,
        week : '.'+Selector.weekView,
        day : '.'+Selector.dayView,
    },
    buttonType : {
        arrow : 'arrow',
        type : 'type',
        today : 'today',
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
        return year + '-' + this.padZero(month, 2) + '-' + this.padZero(date, 2);
    },
    getTbodyFromThead: function(headTd, row) {
        var headEle = headTd.parentNode.parentNode;
        var tds = headEle.querySelectorAll('td');
        for (var i = 0; i < tds.length; i++) {
            if (tds[i].isEqualNode(headTd)) {
                break;
            }
        }
        if (i < tds.length) {
            return headEle.nextElementSibling.children[row].children[i];
        } else {
            return null;
        }
    },
    setTimeByGMT: function(date) {
      var converted = new Date(date);
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
  }
};
