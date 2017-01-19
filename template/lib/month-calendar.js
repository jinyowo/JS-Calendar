// month이름, weekday이름, 각 달의 마지막 날짜를 저장한 배열
var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var weekdayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var weekdayClassArray = ["fc-sun", "fc-mon", "fc-tue", "fc-wed", "fc-thu", "fc-fri", "fc-sat"];
// 1. 처음 캘린더를 켰을 때 : 오늘 날짜가 속해 있는 달의 날짜를 채움
// 2. 화살표 : 오늘을 기준으로 달을 +, - 해서 그 달의 날짜를 채움
// 3. 각각의 날짜는 달력의 칸마다 오브젝트 형태로 저장해서 클릭이벤트시 주고받을 수 있도록함.(fc-day의 data-date속성 이용)

// 오늘의 날짜를 받아옵니다.
var today = new Date();
var thisYear = today.getFullYear();
var thisMonth = today.getMonth(); // 0 ~ 11
var thisDate = today.getDate();


function getLastDate(month) {
    if(month < 0){ month = 11;}

    var lastDate = new Date(thisYear, month+1, 0).getDate();
    return lastDate;
}

setCalendar(thisYear, thisMonth);

// 월에 맞도록 달력에 숫자를 뿌리는 함수
function setCalendar(targetYear, targetMonth) {
    // 해당 년, 월의 1일 구하기
    var firstDate = new Date(targetYear, targetMonth, 1); // 이번달 1일
    var lastDate = getLastDate(targetMonth);
    var firstWeekday = firstDate.getDay();

    // 상단 가운데 월이름, 년도 -TODO: 나중에 함수로 뺄 예정
    var monthTitle = document.querySelector(".fc-center");
    var thisMonthFullname = monthArray[targetMonth];
    monthTitle.innerHTML = "<h2>"+thisMonthFullname+" "+targetYear+"</h2>";

    // 달력에 숫자 뿌리기 - TODO: 함수로 빼기
    var calendar = [];
    var prevMonthLastDate = getLastDate(targetMonth-1);
    var prevMonthfirstDate = prevMonthLastDate - firstWeekday + 1;

    // 지난달에 해당하는 날짜를 먼저 배열에 넣어준다.
    for(var i = prevMonthfirstDate; i<=prevMonthLastDate; i++) {
        calendar.push(i);
    }
    // 이번달에 해당하는 날짜를 추가로 배열에 넣어준다.
    for(var i = 1; i<=lastDate; i++) {
        calendar.push(i);
    }
    // 숫자를 띄울 a태그 전체
    var nums = document.querySelectorAll(".fc-content-skeleton a.fc-day-number");
    var nextMonthDate = 1;
    for(var i=0; i<nums.length; i++) {
        // 다음달 날짜 채우기
        if(calendar[i] === undefined) {
            calendar[i] = nextMonthDate++;
        }
        nums[i].innerText = calendar[i];
    }
}

// 해당 날짜에 대한 정보를 ISO형식으로 div의 data-date속성으로 저장
function saveDate(date) {

}



// 임시
document.querySelector(".fc-basicWeek-view").style.display = "none";
document.querySelector(".fc-agendaDay-view").style.display = "none";
