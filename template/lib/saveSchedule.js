var submitButton = document.querySelector('#submit');
var allDayButton = document.querySelector('#allDay');
var inputList = ["title", "start", "end", "place", "desc"];
// var idList = ["title", "start", "end", "place", "desc", "repeat"];
var scheduleInfo = {};

submitButton.addEventListener("click", getValue);
allDayButton.addEventListener("click", setAllDay);

//저장 버튼 누르면 scheduleInfo object 에 저장됨.
function getValue() {
    for (var i = 0; i < inputList.length; i++) {
        var inputValue = document.getElementById(inputList[i]).value;
        scheduleInfo[inputList[i]] = inputValue;
        // localStorage.setItem(inputList[i], inputValue);
    }
    var repeatValue = document.querySelector('input[name="optradio"]:checked').value;
    scheduleInfo['repeat'] = repeatValue;
    // localStorage.setItem("repeat", repeatValue);

    //확인용 console
    for (var prop in scheduleInfo)
    {
      console.log(scheduleInfo[prop]);
    }
}


// 종일 버튼 누르면 시간 입력 버튼에 자동 입력됨
function setAllDay() {
    if (!allDayButton.checked) {
        document.getElementById("start").value = "";
        document.getElementById("end").value = "";
        return;
    }
    var date = new Date();
    var isoDate = date.toISOString().split('T', 1);
    document.getElementById("start").value = isoDate + "T00:00";
    document.getElementById("end").value = isoDate + "T23:59";
}
