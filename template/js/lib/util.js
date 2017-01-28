// month이름, weekday이름, 각 달의 마지막 날짜를 저장한 배열

//여기서부터 utility 전까지 여러개의 전역변수를 쓰고 있는데, namespace로 객체형태로 모아두면 좋겠음. 

//array와 같은이름을 궂이 쓰지 않아도 될 듯. 그냥 month, week, weekdayclass 라고해도 좋을듯.
var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekdayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var weekdayClassArray = ["fc-sun", "fc-mon", "fc-tue", "fc-wed", "fc-thu", "fc-fri", "fc-sat"];

//이건뭐고 Element.prototype._$ 이건뭐에요? 
var _$ = function(selector) {
    //그리고 이렇게 기준을 모두 document로 찾으면 dom을 찾는데 느려요. 가급적 부모엘리먼트를 지정하는게 좋죠.
  return document.querySelector(selector);
}

Element.prototype._$ = function(selector) {
  return this.querySelector(selector);
};

// 오늘 년, 월, 일 정보를 저장할 object
var _today = new Date();
var Today = {
    year : _today.getFullYear(),
    month : _today.getMonth(),
    date : _today.getDate(),
};
// 달력의 type 3가지를 저장할 object
var calendarType = {
    month : _$(".fc-month-view"),
    week : _$(".fc-basicWeek-view"),
    day : _$(".fc-agendaDay-view"),
};
var buttonType = {
    arrow : "arrow",
    type : "type",
    today : "today",
};

var Utility = {
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
    getTbodyFromThead: function(headEle, tdEle) {
        var tds = headEle.querySelectorAll("td");

        for (var i = 0; i < tds.length; i++) {
            if (tds[i].isEqualNode(tdEle)) {
                break;
            }
        }
        if (i < tds.length) {
            return headEle.nextElementSibling.firstElementChild.children[i];
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
        //utility에 있기에는 너무 특별한 녀석이 정의되어 있네요. 한군데에서만 사용하면 거기로 옮겨주시거나, eventRow엘리먼트리스트를 매개변수로 받도록 하고요.
        var eventRow = document.querySelectorAll(".fc-content-skeleton tbody");

        //꼭 개행이 필요한가요?(잘몰라서)
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
    setTimeByGMT: function(date) {
      var converted = new Date();
      converted.setYear(date.getUTCFullYear());
      converted.setMonth(date.getUTCMonth());
      converted.setDate(date.getUTCDate());
      converted.setHours(date.getUTCHours());
      converted.setMinutes(date.getUTCMinutes());
      converted.setSeconds(date.getUTCSeconds());
      return converted;
    }
};
