//테스트용 object
var schedule = {
    title: "NTS intern",
    start: "2017-01-02T08:00:00Z",
    end: "2017-02-10T19:00:00Z",
    repeat: "W",
    allDay: true,
    place: "startup campus",
    desc: "FE 인턴 education"
};

var test1 = [{
    "title": "제목1",
    "place": "장소1",
    "desc": "설명1",
    "start": "2017-01-04T16:07:00Z",
    "end": "2017-01-04T17:07:00Z",
    "allDay": false,
    "repeat": "none"
}, {
    "title": "제목2",
    "place": "장소2",
    "desc": "설명2",
    "start": "2017-01-04T16:08:00Z",
    "end": "2017-01-04T17:08:00Z",
    "allDay": true,
    "repeat": "none"
}, {
    "title": "제목3",
    "place": "장소3",
    "desc": "설명3",
    "start": "2017-01-04T18:08:00Z",
    "end": "2017-01-04T22:08:00Z",
    "allDay": false,
    "repeat": "none"
}];

localStorage.setItem("2017-01-04S2017-01-04E", JSON.stringify(test1));

var testArray = JSON.parse(localStorage.getItem("2017-01-04S2017-01-04E"));
var position = 0;
var testPosition = undefined ;

// 테스트용 coding

function DetailView() {
    this.repeat = {
        Y: "매년",
        M: "매월",
        W: "매주",
        D: "매일",
        none: "반복안함"
    };
    this.popupBackground = _$('.popupBackground');
    this.popupContent = _$('.popupContent');
    this.span = _$('.popupClose');
    this.parsedContent = _$('.parsedContent');
}
DetailView.prototype = {
    init: function() {
        this.span.addEventListener("click", this.closePopup.bind(this));
        this.popupBackground.addEventListener("click", this.closePopup.bind(this));
        document.addEventListener("click", this.executeEvent.bind(this));
    },
    executeEvent: function(event) {
        if (this.confirmTarget(event)) {
            Utility.showElement(this.popupBackground);
            this.getCoordinate(event);
            this.insertPopupContent();
        }
    },
    closePopup: function() {
        Utility.hideElement(this.popupBackground);
    },
    confirmTarget: function(event) {
        if (event.target.className === "fc-content" || event.target.className === "fc-title") {
            return true;
        } else return false;
    },
    getCoordinate: function(event) {
        var centerPointX = (window.innerWidth) / 2;
        var centerPointY = (window.innerHeight) / 2;
        var x = event.clientX;
        var y = event.clientY;
        var pcStyle = this.popupContent.style;
        var pcHeight = this.popupContent.offsetHeight;
        var pcWidth = this.popupContent.offsetWidth;
        if (x <= centerPointX && y <= centerPointY) {
            pcStyle.top = y + 'px';
            pcStyle.left = x + 'px';
        } else if (x > centerPointX && y <= centerPointY) {
            pcStyle.top = y + 'px';
            pcStyle.left = (x - pcWidth) + 'px';
        } else if (x <= centerPointX && y > centerPointY) {
            pcStyle.top = (y - pcHeight) + 'px';
            pcStyle.left = x + 'px';
        } else if (x > centerPointX && y > centerPointY) {
            pcStyle.top = (y - pcHeight) + 'px';
            pcStyle.left = (x - pcWidth) + 'px';
        }
    },
    getParsedTime: function() {
        var fixedStart = testArray[position]['start'].replace("T", " ");
        var fixedEnd = testArray[position]['end'].replace("T", " ");
        var parsedStart = fixedStart.replace(":00Z", "");
        var parsedEnd = fixedEnd.replace(":00Z", "");
        return [parsedStart, parsedEnd];
    },
    insertPopupContent: function() {
        var timeData = this.getParsedTime();
        var stringData = _$("#popup-template").innerHTML;
        Handlebars.registerHelper('time', function(){
          return timeData[0]+'~'+timeData[1];
        });
        Handlebars.registerHelper('repeat', function(){
          return this.repeat[testArray[position]['repeat']];
        }.bind(this));
        var compiled = Handlebars.compile(stringData);
        var str = compiled(testArray[position]);
        _$('.parsedContent').innerHTML = str;
    }
};

function deleteSchedule() {
    this.deleteButton = _$('.delete');
}
deleteSchedule.prototype = {
    init: function() {
        this.deleteButton.addEventListener("click", this.showConfirm.bind(this));
    },
    showConfirm: function() {
        var message= "일정을 삭제하시겠습니까?";
        var deleteConfirm = confirm(message);
        if (deleteConfirm) { // Yes click
            this.deleteInfo();
        }
    },
    deleteInfo: function() {
        var alreadyHas = localStorage.getItem("2017-01-04S2017-01-04E");
        var parsedArray = JSON.parse(alreadyHas);
        parsedArray.splice(position, 1);
        localStorage.setItem("2017-01-04S2017-01-04E", JSON.stringify(parsedArray));

        //테스트용 출력
        var test = localStorage.getItem("2017-01-04S2017-01-04E");
        console.log(test);
    }
};

function modifySchedule() {
    this.modifyButton = _$('.modify');
  }
modifySchedule.prototype = {
    init: function(option) {
        this.callbacklist = option;
        this.modifyButton.addEventListener("click", this.changeForm.bind(this));
    },
    changeForm: function() {
        _$(".scheduleBackground").style.display = "block";
        _$(".popupBackground").style.display = "none";
        this.insertForm();

    },
    insertForm: function() {

        var startData = testArray[position]["start"].replace(':00Z', "").split('T', 2);
        var endData = testArray[position]["end"].replace(':00Z', "").split('T', 2);
        _$("#title").value = testArray[position]["title"];
        _$("#place").value = testArray[position]["place"];
        _$("#desc").value = testArray[position]["desc"];
        if (testArray[position]["allDay"]) _$('#allDay').checked = true;
        _$('input[value=' + testArray[position]["repeat"] + ']').checked = true;
        _$("#startDay").value = startData[0];
        _$("#startTime").value = startData[1];
        _$("#endDay").value = endData[0];
        _$("#endTime").value = endData[1];
    },
//     getInputValue: function() {
//         var scheduleInfo = this.callbacklist["GET_INFO"].call(modifyInfo);
//         console.log(scheduleInfo); // 테스트용
//         var alreadyHas = localStorage.getItem("2017-01-04S2017-01-04E");
//         var parsedArray = JSON.parse(alreadyHas);
//         parsedArray.splice(position, 1, scheduleInfo);
//         localStorage.setItem("2017-01-04S2017-01-04E", JSON.stringify(parsedArray));
//
//         //테스트용 출력
//         var test = localStorage.getItem("2017-01-04S2017-01-04E");
//         console.log(test);
//     }
};
var showDetail = new DetailView();
showDetail.init();
var deleteEvent = new deleteSchedule();
deleteEvent.init();
var modifyEvent = new modifySchedule();
var modifyInfo = new SubmitInfo();
modifyInfo.init();
modifyEvent.init({
    SUBMIT_BUTTON: modifyInfo.submitButton,
    GET_INFO: modifyInfo.getScheduleInfo,
    SUBMIT_INFO: modifyInfo.saveScheduleInfo
});
