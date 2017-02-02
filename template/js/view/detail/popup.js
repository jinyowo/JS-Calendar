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
    this.monthView = _$('.fc-month-view');
}
DetailView.prototype = {
    init: function() {
        this.span.addEventListener("click", this.closePopup.bind(this));
        this.popupBackground.addEventListener("click", this.closePopup.bind(this));
        this.monthView.addEventListener("click", this.executeEvent.bind(this));
    },
    executeEvent: function(event) {
        if (this.confirmTarget(event)) {
            Utility.showElement(this.popupBackground);
            this.getCoordinate(event);
            this.getSchedule(event.target);
            this.insertPopupContent();

        }
    },
    getSchedule: function(target) {
        var realTarget = target.closest("a");
        var key = realTarget.getAttribute("data-key");
        var pos = parseInt(realTarget.getAttribute("data-pos"));
        var array = JSON.parse(localStorage.getItem(key));
        this.content = array[pos];
        this.keyset = [key, pos];

    },
    closePopup: function() {
        Utility.hideElement(this.popupBackground);
    },
    confirmTarget: function(event) {
        if (event.target.closest("a")) {
            if (event.target.closest("a").classList.contains("fc-event")) {
                return true;
            } else return false;
        }
        return false;
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
        var fixedStart = this.content['start'].replace("T", " ");
        var fixedEnd = this.content['end'].replace("T", " ");
        var parsedStart = fixedStart.replace(":00Z", "");
        var parsedEnd = fixedEnd.replace(":00Z", "");
        return [parsedStart, parsedEnd];
    },
    insertPopupContent: function() {
        var timeData = this.getParsedTime();
        var stringData = _$("#popup-template").innerHTML;
        Handlebars.registerHelper('time', function() {
            return timeData[0] + '~' + timeData[1];
        });
        Handlebars.registerHelper('repeat', function() {
            return this.repeat[this.content['repeat']];
        }.bind(this));
        var compiled = Handlebars.compile(stringData);
        var str = compiled(this.content);
        _$('.parsedContent').innerHTML = str;
    },
    getKeySet: function() {
        return this.keyset;
    }
};

function deleteSchedule() {
    this.deleteButton = _$('.delete');
}
deleteSchedule.prototype = {
    init: function(option) {
        this.callbacklist=option;
        this.deleteButton.addEventListener("click", this.showConfirm.bind(this));
    },
    showConfirm: function() {
        var message = "일정을 삭제하시겠습니까?";
        var deleteConfirm = confirm(message);
        if (deleteConfirm) { // Yes click
            this.deleteInfo();
        }
    },
    deleteInfo: function() {
        var keyset = this.callbacklist["KEYSET"]();
        var alreadyHas = localStorage.getItem(keyset[0]);
        var parsedArray = JSON.parse(alreadyHas);
        parsedArray.splice(keyset[1], 1);
        localStorage.setItem(keyset[0], JSON.stringify(parsedArray));

        //테스트용 출력
        var test = localStorage.getItem(keyset[0]);
        console.log(test);
        location.reload(true);
    }
};

function modifySchedule() {
    this.modifyButton = _$('.modify');
    this.changeButton = _$('#modify');
}
modifySchedule.prototype = {
    init: function(option) {
        this.callbacklist = option;
        this.modifyButton.addEventListener("click", this.changeForm.bind(this));
        this.changeButton.addEventListener("click", this.getInputValue.bind(this) );
    },
    changeForm: function() {
        _$(".scheduleBackground").style.display = "block";
        _$(".popupBackground").style.display = "none";
        _$("#submit").style.display = "none";
        _$("#modify").style.display = "inline-block";
        this.insertForm();
    },

    insertForm: function() {
        var keyset = this.callbacklist["KEYSET"]();
        var array1 = JSON.parse(localStorage.getItem(keyset[0]));
        var position = keyset[1];
        var startData = array1[position]["start"].replace(':00Z', "").split('T', 2);
        var endData = array1[position]["end"].replace(':00Z', "").split('T', 2);
        _$("#title").value = array1[position]["title"];
        _$("#place").value = array1[position]["place"];
        _$("#desc").value = array1[position]["desc"];
        if (array1[position]["allDay"]) _$('#allDay').checked = true;
        _$('input[value=' + array1[position]["repeat"] + ']').checked = true;
        _$("#startDay").value = startData[0];
        _$("#startTime").value = startData[1];
        _$("#endDay").value = endData[0];
        _$("#endTime").value = endData[1];
    },
    getInputValue: function(position) {
        var keyset = this.callbacklist["KEYSET"]();
        var scheduleInfo = this.callbacklist["GET_INFO"].bind(modifyInfo)();
        console.log(scheduleInfo); // 테스트용
        var alreadyHas = localStorage.getItem(keyset[0]);
        var parsedArray = JSON.parse(alreadyHas);
        parsedArray.splice(keyset[1], 1, scheduleInfo);
        localStorage.setItem(keyset[0], JSON.stringify(parsedArray));

        //테스트용 출력
        var test = localStorage.getItem(keyset[0]);
        console.log(test);
    }
};
var showForm = new ShowFormPopup();
showForm.init();
var showDetail = new DetailView();
showDetail.init();
var deleteEvent = new deleteSchedule();

var modifyEvent = new modifySchedule();
var modifyInfo = new SubmitInfo();
modifyInfo.init();
modifyEvent.init({
    SUBMIT_BUTTON: modifyInfo.submitButton,
    GET_INFO: modifyInfo.getScheduleInfo,
    SUBMIT_INFO: modifyInfo.saveScheduleInfo,
    KEYSET: showDetail.getKeySet.bind(showDetail)
});
deleteEvent.init({
    KEYSET: showDetail.getKeySet.bind(showDetail)
});
