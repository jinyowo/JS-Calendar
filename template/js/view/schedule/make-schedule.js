var div = _$('.fc-widget-content');
var scheduleBackground = _$('.scheduleBackground');
var closeButton = _$('.closeButton');
var container = _$('.scheduleBackground');
var allDayButton = _$('#allDay');
var submitButton = _$('#submit');
var defaultStart="";
var defaultEnd="";
var inputList1 = ["title", "place", "desc"];
var inputList2 = ["start", "end"];

window.addEventListener("click", function(event) {
    if (event.target.className === "scheduleBackground") {
        closeForm();
    }
});
div.addEventListener("click", getDateInfo);
closeButton.addEventListener('click', closeForm);
allDayButton.addEventListener("click", setAllDay);
submitButton.addEventListener("click", getValue);

// 클릭한 날짜 칸의 날짜정보를 가져온다.
function getDateInfo(event) {
    var dateData = "";
    dateData = event.target.getAttribute("data-date");
    if (event.target.className === "fc-day-number") {
        dateData = event.target.parentNode.getAttribute("data-date");
    }
    if (!!dateData) {
        showForm();
        makeEvent(dateData);
    }
}
// 폼에 입력된 값을 가져오고 로컬스토리지에 "날짜값"을 키값으로 저장한다.
function getValue() {
    var startDay = getStartday();
    var scheduleArray = [];
    var scheduleInfo = {};
    var alreadyHas = localStorage.getItem(startDay);

    for (var i = 0; i < inputList1.length; i++) {
        var inputValue = document.getElementById(inputList1[i]).value;
        scheduleInfo[inputList1[i]] = inputValue;
        // localStorage.setItem(inputList[i], inputValue);
    }

    for (var j = 0; j < inputList2.length; j++) {
        var timeValue = document.getElementById(inputList2[j]).value;
        scheduleInfo[inputList2[j]] = timeValue + ":00Z";
    }
    var repeatValue = _$('input[name="optradio"]:checked').value;
    scheduleInfo['repeat'] = repeatValue;
    if (!!alreadyHas) {
        var parsedArray = JSON.parse(alreadyHas);
        parsedArray.push(scheduleInfo);
        localStorage.setItem(startDay, JSON.stringify(parsedArray));
    } else {
        scheduleArray.push(scheduleInfo);
        localStorage.setItem(startDay, JSON.stringify(scheduleArray));
    }

}
// 키값의 날짜를 뽑아낸다.
function getStartday() {
    var startTime = document.getElementById('start').value;
    var startDay = startTime.split('T', 1);
    return startDay;
}
//클릭한 날짜 칸의 정보를 팝업에 입력한다. 시간 간격은 한시간으로 정함.
function makeEvent(dateData) {
    var date = new Date();
    var timedate1 = date.toTimeString();
    var Date1 = timedate1.split(':', 3);

    date.setHours(date.getHours() + 1);
    var timedate2 = date.toTimeString();
    var Date2 = timedate2.split(':', 3);
    defaultStart = dateData + 'T' + Date1[0] + ':' + Date1[1];
    defaultEnd = dateData + 'T' + Date2[0] + ':' + Date2[1];
    document.getElementById("start").defaultValue = dateData + 'T' + Date1[0] + ':' + Date1[1];
    document.getElementById("end").defaultValue = dateData + 'T' + Date2[0] + ':' + Date2[1];
}
// 종일 버튼 누를시 기간이 24시간으로 바뀐다.
function setAllDay() {
    if (!allDayButton.checked) {
        document.getElementById("start").value = defaultStart;
        document.getElementById("end").value = defaultEnd;
        return;
    }

    var parsedDate1 = defaultStart.split('T', 1);
    var parsedDate2 = defaultEnd.split('T',1);
    document.getElementById("start").value = parsedDate1 + "T00:00";
    document.getElementById("end").value = parsedDate2 + "T23:59";
}
// 팝업을 닫는다.
function closeForm() {
    container.style.display = "none";
}
// 팝업을 나타낸다.
function showForm() {
    container.style.display = "block";
}
