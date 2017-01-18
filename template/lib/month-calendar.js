var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var weekdayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


// 오늘의 날짜를 받아옵니다.
var date = new Date();
var y = date.getFullYear();
var m = date.getMonth();
var d = date.getDate();

var fullMonthName = monthArray[m];

// 이번달 1일
var firstDate = new Date(y, m, 1);
var firstDay = weekdayArray[firstDate.getDay()];

var last = [31,28,31,30,31,30,31,31,30,31,30,31];
var lastDate = last[m];

// 4년마다 있는 윤년을 계산합니다.(100년||400년 주기는 제외)

// .fc-center : 상단 가운데 월이름, 년도
var monthTitle = document.querySelector(".fc-center");
monthTitle.innerHTML = "<h2>"+fullMonthName+" "+y+"</h2>";

//달력 숫자 표시 .fc-day-grid > .fc-content-skeleton > thead > tr > td.fc-day-top > a
var rows = document.querySelectorAll(".fc-month-view .fc-day-grid .fc-row");
var firstRow = rows.firstElementNodes;
console.log(firstRow.childNodes);




// 임시
document.querySelector(".fc-basicWeek-view").style.display = "none";
document.querySelector(".fc-agendaDay-view").style.display = "none";
