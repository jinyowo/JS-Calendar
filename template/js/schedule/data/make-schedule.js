var div = document.querySelector('.fc-widget-content');
// 이벤트를 달력칸으로 한정
div.addEventListener("click", getDateInfo);
// 달력칸의 날짜 정보를 뽑아내고, 날짜 정보가 있다면 스케줄 작성 form으로 이동한다.
function getDateInfo(event) {
    var dateData = "";
    dateData = event.target.getAttribute("data-date");
    if (event.target.className === "fc-day-number") {
        dateData = event.target.parentNode.getAttribute("data-date");
    }
    if (!!dateData) {
        saveData(dateData);
        window.location.href = "schedule-form.html";
    }
}
//클릭한 칸의 날짜 정보를 로컬스토리지에 저장한다.
function saveData(dateData) {
    localStorage.setItem("dateKey", dateData);
}
