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

function ShowDetail() {
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
ShowDetail.prototype = {
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
        var fixedStart = schedule['start'].replace("T", " ");
        var fixedEnd = schedule['end'].replace("T", " ");
        var parsedStart = fixedStart.replace(":00Z", "");
        var parsedEnd = fixedEnd.replace(":00Z", "");
        return [parsedStart, parsedEnd];
    },
    insertPopupContent: function() {
        var timeData = this.getParsedTime();
        var stringData = "<strong><%= title %></strong><br><label >시간: </label><span>" + timeData[0] + " ~ " + timeData[1] + "</span><br><label >반복: </label><span>" + this.repeat[schedule['repeat']] + "<span><br><label >장소: </label><span><%= place %></span><br><label >설명: </label><span><%= desc %></span>";
        var compiled = _.template(stringData);
        var str = compiled(schedule);
        _$('.parsedContent').innerHTML = str;
    }
};

function deleteSchedule() {
    this.deleteButton = _$('.delete');
}
deleteSchedule.prototype = {
    init: function() {
        this.deleteButton.addEventListener("click", this.showConfirm);
    },
    showConfirm: function() {
            var msg = confirm("일정을 삭제하시겠습니까?");
            if (msg) { // Yes click
            } else {
                // no click
            }
        }
        // ,
        // deleteInfo: function() {
        //     var alreadyHas = localStorage.getItem(startDay)
        //     var parsedArray = JSON.parse(alreadyHas);
        //     parsedArray.splice(index,1);
        //     localStorage.setItem(startDay, JSON.stringify(parsedArray))
        // }
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
        // this.insertForm();
    },
    // insertForm: function() {
    //     _$("#title").value = schedule["title"];
    //     _$("#start").value = schedule["start"].replace(':00Z',"");
    //     _$("#end").value = schedule["end"].replace(':00Z',"");
    //     _$("#place").value = schedule["place"];
    //     _$("#desc").value = schedule["desc"];
    //     if(schedule["allDay"]) _$('#allDay').checked =true;
    //     _$('input[value='+schedule["repeat"]+']').checked =true;
    // }
};
var showDetail = new ShowDetail();
showDetail.init();
var deleteEvent = new deleteSchedule();
deleteEvent.init();
var modifyEvent = new modifySchedule();
modifyEvent.init({
    POPUP_CONTENT: showDetail.insertPopupContent
});
