// month이름, weekday이름, 각 달의 마지막 날짜를 저장한 배열
var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var weekdayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var weekdayClassArray = ["fc-sun", "fc-mon", "fc-tue", "fc-wed", "fc-thu", "fc-fri", "fc-sat"];

var myMonth = -1;
var myYear = -1;
function getLastDate(month) {
    if(month < 0){ month = 11;}

    var lastDate = new Date(myYear, month+1, 0).getDate();
    return lastDate;
}

// 월에 맞도록 달력에 숫자를 뿌리는 함수
function setCalendar() {
    // 해당 년, 월의 1일 구하기
    var firstDate = new Date(myYear, myMonth, 1); // 이번달 1일

    var lastDate = getLastDate(myMonth);
    var firstWeekday = firstDate.getDay();

    // 상단 가운데 월이름, 년도 -TODO: 나중에 함수로 뺄 예정
    var monthTitle = document.querySelector(".fc-center");
    var thisMonthFullname = monthArray[myMonth];
    monthTitle.innerHTML = "<h2>"+thisMonthFullname+" "+myYear+"</h2>";

    // 달력에 숫자 뿌리기 - TODO: 함수로 빼기
    var calendar = [];

    var prevMonthLastDate = getLastDate(myMonth-1);
    var cells = document.querySelectorAll(".fc-month-view .fc-day-top");

    var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;
    var currentDate = 0;

    // 지난달에 해당하는 날짜를 먼저 배열에 넣어준다.
    for(var i = prevMonthfirstDate; i<=prevMonthLastDate; i++) {
        cells[currentDate].setAttribute("data-date", formDate(myYear, myMonth, i));
        if(!cells[currentDate].className.includes("fc-other-month")) {
          cells[currentDate].className += " fc-other-month";
        }
        currentDate++;
        calendar.push(i);
    }
    // 이번달에 해당하는 날짜를 추가로 배열에 넣어준다.
    for(var i = 1; i<=lastDate; i++) {
        cells[currentDate].setAttribute("data-date", formDate(myYear, myMonth + 1, i));
        if(cells[currentDate].className.includes("fc-other-month")) {
            removeClass(cells[currentDate], "fc-other-month");
        }
        currentDate++;

        calendar.push(i);
    }
    // 숫자를 띄울 a태그 전체
    var nums = document.querySelectorAll(".fc-content-skeleton a.fc-day-number");
    var nextMonthDate = 1;
    for(var i=0; i<nums.length; i++) {
        // 다음달 날짜 채우기
        if(calendar[i] === undefined) {
            cells[currentDate].setAttribute("data-date", formDate(myYear, myMonth + 2, nextMonthDate));
            if(!cells[currentDate].className.includes("fc-other-month")) {
                cells[currentDate].className += " fc-other-month";
            }
            currentDate++;
            calendar[i] = nextMonthDate++;
        }
        nums[i].innerText = calendar[i];
    }
}

// 해당 날짜에 대한 정보를 ISO형식으로 div의 data-date속성으로 저장
function saveDate(date) {

}

function moveMonth(evt) {
    var prevArrowClass = "fc-prev-button";
    var nextArrowClass = "fc-next-button";

    var button = evt.target.closest("button");

    if(button.classList.contains(prevArrowClass)) {
        myMonth--;
    } else if(button.classList.contains(nextArrowClass)) {
        myMonth++;
    }

    if(myMonth < 0) { myMonth = 11; myYear--;}
    else if(myMonth > 11) { myMonth = 0; myYear++;}

    setCalendar();
}
function setMyDate(year, month) {
    myMonth = month;
    myYear = year;
}
document.addEventListener("DOMContentLoaded", init);
function init() {
    // 오늘의 날짜를 받아옵니다.
    var today = new Date();
    var thisYear = today.getFullYear();
    var thisMonth = today.getMonth(); // 0 ~ 11
    var thisDate = today.getDate();

    setMyDate(thisYear, thisMonth);
    setCalendar();

    // 화살표 달력 이동
    var arrowButtons = document.querySelector(".fc-left .fc-button-group");
    arrowButtons.addEventListener("click", moveMonth);
}

// 임시
document.querySelector(".fc-basicWeek-view").style.display = "none";
document.querySelector(".fc-agendaDay-view").style.display = "none";
