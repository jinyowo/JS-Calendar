var submitButton = document.querySelector('#submit');
var allDayButton = document.querySelector('#allDay');
var inputList = ["title", "start", "end", "place", "desc"];
var idList = ["title", "start", "end", "place", "desc", "repeat"];


submitButton.addEventListener("click", getValue);
allDayButton.addEventListener("click", setAllDay);

function getValue() {
    for (var i = 0; i < idputList.length; i++) {
        var inputValue = document.getElementById(idputList[i]).value;
        localStorage.setItem(idputList[i], inputValue);
    }
    var repeatValue = document.querySelector('input[name="optradio"]:checked').value;
    localStorage.setItem("repeat", repeatValue);
}


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
