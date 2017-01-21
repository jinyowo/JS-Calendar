//테스트용 object
var schedule = {
    title: "NTS intern",
    start: "2017-01-02T08:00",
    end: "2017-02-10T19:00",
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

var popupBackground = document.querySelector('.popupBackground');
var popupContent = document.querySelector('.popupContent');
var span = document.querySelector('.popupClose');

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
    if (event.target.className === "fc-content") {
        showPopup();
        getCoordinate(event);
        insertPopupContent();
    }
});

function closePopup(){
  popupBackground.style.display = "none";
}
function showPopup(){
  popupBackground.style.display = "block";
}
// 클릭한 지점 좌표 반영
function getCoordinate(event){
  var x = event.clientX,
      y = event.clientY;
  popupContent.style.top = y + 'px';  // - popupContent.offsetHeight
  popupContent.style.left = x + 'px';
}
function insertPopupContent(){
  var parsedStart = schedule['start'].replace("T", " ");
  var parsedEnd = schedule['end'].replace("T", " ");
  var strdata = "<strong><%= title %></strong><br><label >시간: </label><span>" + parsedStart + " ~ " + parsedEnd + "</span><br><label >반복: </label><span>" + repeat[schedule['repeat']] + "<span><br><label >장소: </label><span><%= place %></span><br><label >설명: </label><span><%= desc %></span>";
  var compiled = _.template(strdata);
  var str = compiled(schedule);
  document.querySelector('.parsedContent').innerHTML = str;
}
