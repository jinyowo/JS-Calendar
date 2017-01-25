//테스트용 object
var schedule = {
    title: "NTS intern",
    start: "2017-01-02T08:00:00Z",
    end: "2017-02-10T19:00:00Z",
    repeat: "W",
    place: "startup campus",
    desc: "FE 인턴 education"
};
//반복 주기 object
var repeat = {
    Y: "매년",
    M: "매월",
    W: "매주",
    D: "매일",
    none: "반복안함"
};

var popupBackground = _$('.popupBackground');
var popupContent = _$('.popupContent');
var span = _$('.popupClose');
var deleteButton = _$('.delete');
// x클릭시 팝업 닫기
span.addEventListener("click", closePopup);
// 팝업 바깥영역 클릭시 팝업 닫기
window.addEventListener("click", function(event) {
    if (event.target.className === "popupBackground") {
        closePopup();
    }
});
// fc-content class content 클릭시 popup 출력
document.addEventListener("click", function(event) {
    if (confirmTarget(event)) {
        showPopup();
        getCoordinate(event);
        insertPopupContent();
    }
});
deleteButton.addEventListener("click", deleteSchedule);

function confirmTarget(event) {
    if (event.target.className === "fc-content" || event.target.className === "fc-title") {
        return true;
    } else return false;
}

function closePopup() {
    popupBackground.style.display = "none";
}

function showPopup() {
    popupBackground.style.display = "block";
}
// 클릭한 지점 좌표 반영, 화면을 중심점을 기준으로 4분면으로 나워서 팝업 위치를 각각 다르게 함
function getCoordinate(event) {
    var centerPointX = (window.innerWidth) / 2;
    var centerPointY = (window.innerHeight) / 2;
    var x = event.clientX;
    var y = event.clientY;
    if (x <= centerPointX && y <= centerPointY) {
        popupContent.style.top = y + 'px';
        popupContent.style.left = x + 'px';
    } else if (x > centerPointX && y <= centerPointY) {
        popupContent.style.top = y + 'px';
        popupContent.style.left = (x - popupContent.offsetWidth) + 'px';
    } else if (x <= centerPointX && y > centerPointY) {
        popupContent.style.top = (y - popupContent.offsetHeight) + 'px';
        popupContent.style.left = x + 'px';
    } else if (x > centerPointX && y > centerPointY) {
        popupContent.style.top = (y - popupContent.offsetHeight) + 'px';
        popupContent.style.left = (x - popupContent.offsetWidth) + 'px';
    }
}
//팜업 상세일정 표시
function insertPopupContent() {
    var fixedStart = schedule['start'].replace("T", " ");
    var fixedEnd = schedule['end'].replace("T", " ");
    var parsedStart =  fixedStart.replace(":00Z","");
    var parsedEnd = fixedEnd.replace(":00Z","");
    var stringData = "<strong><%= title %></strong><br><label >시간: </label><span>" + parsedStart + " ~ " + parsedEnd + "</span><br><label >반복: </label><span>" + repeat[schedule['repeat']] + "<span><br><label >장소: </label><span><%= place %></span><br><label >설명: </label><span><%= desc %></span>";
    var compiled = _.template(stringData);
    var str = compiled(schedule);
    _$('.parsedContent').innerHTML = str;
}

function deleteSchedule() {
    var msg = confirm("일정을 삭제하시겠습니까?");
    if (msg) { // Yes click

    } else {
        // no click
    }
}
