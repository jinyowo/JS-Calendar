function DetailView() {
    this.repeat = {
        Y: "매년",
        M: "매월",
        W: "매주",
        D: "매일",
        none: "반복안함"
    };
    this.popupBackground = $('.popupBackground');
    this.popupContent = _$('.popupContent');
    this.span = $('.popupClose');
    this.parsedContent = _$('.parsedContent');
    this.monthView = $('.fc-month-view');
    this.deleteButton = $('.delete');
    this.modifyConfirmButton = $('.modify');
    this.modifyButton = $('#modify');
    this.startDayInput = _$("#startDay");
    this.endDayInput = _$("#endDay");
}
DetailView.prototype = {
    init: function(option) {
        this.callbacklist = option;
        this.span.on("click", this.closePopup.bind(this));
        this.popupBackground.on("click", this.closePopup.bind(this));
        this.monthView.on("click", this.executeEvent.bind(this));
        this.deleteButton.on("click", this.showConfirm.bind(this));
        this.modifyConfirmButton.on("click", this.changeForm.bind(this));
        this.modifyButton.on("click", this.getModifiedInfo.bind(this));
    },
    changeForm: function() {
        $(".scheduleBackground").slideDown("slow");
        this.popupBackground.fadeOut("fast");
        _$("#submit").style.display = "none";
        this.modifyButton.css("display", "inline-block");
        this.insertForm();
    },
    insertForm: function() {
        var savedArray = JSON.parse(localStorage.getItem(this.keyset[0]));
        var position = this.keyset[1];
        var dataObject = savedArray[position];
        var startData = dataObject['start'].replace(':00Z', "").split('T', 2);
        var endData = dataObject["end"].replace(':00Z', "").split('T', 2);
        _$("#title").value = dataObject["title"];
        _$("#place").value = dataObject["place"];
        _$("#desc").value = dataObject["desc"];
        if (dataObject["allDay"]) _$('#allDay').checked = true;
        _$('input[value=' + dataObject["repeat"] + ']').checked = true;
        this.startDayInput.value = startData[0];
        this.endDayInput.value = endData[0];
        _$("#startTime").value = startData[1];
        _$("#endTime").value = endData[1];
    },
    getModifiedInfo: function() {
        var keyValue = this.callbacklist["DAYKEY"]();
        var scheduleInfo = this.callbacklist["GET_INFO"].bind(modifyInfo)();
        var alreadyHas1 = localStorage.getItem(this.keyset[0]);
        var parsedArray1 = JSON.parse(alreadyHas1);
        if (keyValue === this.keyset[0]) {
            parsedArray1.splice(this.keyset[1], 1, scheduleInfo);
            localStorage.setItem(this.keyset[0], JSON.stringify(parsedArray1));
        } else if (keyValue !== this.keyset[0]) {
            parsedArray1.splice(this.keyset[1], 1);
            localStorage.setItem(this.keyset[0], JSON.stringify(parsedArray1));
            if (parsedArray1.length === 0) {
                localStorage.removeItem(this.keyset[0]);
            }
            this.saveModifyInfo(keyValue, scheduleInfo);
        }
    },
    saveModifyInfo: function(keyValue, scheduleInfo) {
        var alreadyHas2 = localStorage.getItem(keyValue);
        var scheduleArray = [];
        if (!!alreadyHas2) {
            var parsedArray2 = JSON.parse(alreadyHas2);
            parsedArray2.push(scheduleInfo);
            localStorage.setItem(keyValue, JSON.stringify(parsedArray2));
        } else {
            scheduleArray.push(scheduleInfo);
            localStorage.setItem(keyValue, JSON.stringify(scheduleArray));
        }
    },
    showConfirm: function() {
        var message = "일정을 삭제하시겠습니까?";
        var deleteConfirm = confirm(message);
        if (deleteConfirm) { // Yes click
            this.deleteInfo();
        }
    },
    deleteInfo: function() {
        var alreadyHas = localStorage.getItem(this.keyset[0]);
        var parsedArray = JSON.parse(alreadyHas);
        parsedArray.splice(this.keyset[1], 1);
        localStorage.setItem(this.keyset[0], JSON.stringify(parsedArray));
        if (parsedArray.length === 0) {
            localStorage.removeItem(this.keyset[0]);
        }
        location.reload(true);
    },
    executeEvent: function(event) {
        if (this.confirmTarget(event.target)) {
            this.popupBackground.fadeIn("fast");
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
        this.popupBackground.fadeOut("fast");
    },
    confirmTarget: function(target) {
        if (target.closest("a")) {
            if (target.closest("a").classList.contains("fc-event")) {
                return true;
            } else return false;
        }
        return false;
    },
    getCoordinate: function(event) {

        var calendar = document.querySelector(".fc-body");

        var rect = calendar.getBoundingClientRect();
        var Top = rect.top;
        var Left = rect.left;

        var offsetWidth = calendar.offsetWidth;
        var offsetHeight = calendar.offsetHeight;

        var centerPointX = Left + (offsetWidth / 2);
        var centerPointY = Top + (offsetHeight / 2);
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
        this.parsedContent.innerHTML = str;
    }
};

var showForm = new FormView();
var showDetail = new DetailView();
var modifyInfo = new Submission();
showForm.init();
modifyInfo.init({
    CHECK_COLOR: "LightGray",
    NON_CHECK_COLOR: "White"
});
showDetail.init({
    GET_INFO: modifyInfo.getScheduleInfo,
    DAYKEY: modifyInfo.setDayKey.bind(modifyInfo),
    KEY_VALUE: modifyInfo.keyValue
});
