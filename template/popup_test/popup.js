var schedule={ };
var popup = document.getElementById('popup');

var span = document.querySelector('.popupClose');

// fc-content class content 클릭시 popup 출력
document.addEventListener("click",function(event) {
    if(event.target.className ==="fc-content"){
    popup.style.display = "block";}
} );
span.addEventListener("click",function() {
    popup.style.display = "none";
});


// x클릭시 팝업 닫기
span.onclick = function() {
    popup.style.display = "none";
};

// 팝업 바깥영역 클릭시 팝업 닫기
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
};
