var Data = {
    manyEvent : [{
        "title": "발렌타인데이",
        "place": "서울",
        "desc": "여자친구랑",
        "start": "2017-02-14T16:07:00Z",
        "end": "2017-02-14T17:07:00Z",
        "allDay": false,
        "repeat": "Y"
    }, {
        "title": "여자친구랑 1주년",
        "place": "서울",
        "desc": "1주년",
        "start": "2017-02-14T16:08:00Z",
        "end": "2017-02-14T17:08:00Z",
        "allDay": true,
        "repeat": "none"
    }],
    longEvent : [{
        title: "크리스마스",
        start: "2016-12-25T00:00:00Z",
        end: "2016-12-25T11:59:00Z",
        allDay: true,
        repeat: "Y",
        place: "",
        desc: ""
    }],
    repeatEventW : [{
        title: "설 연휴",
        start: "2017-01-27T00:00:00Z",
        end: "2017-01-30T02:59:00Z",
        allDay: true,
        repeat: "none",
        place: "",
        desc: "30일 대체공휴일"
    }],
    repeatEventM : [{
        title: "화이트데이",
        start: "2017-03-14T00:00:00Z",
        end: "2017-03-14T02:59:00Z",
        allDay: true,
        repeat: "Y",
        place: "",
        desc: ""
    }],
};

localStorage.setItem("2017-02-14S2017-02-14E", JSON.stringify(Data.manyEvent));
localStorage.setItem("2016-12-25S2016-12-25E", JSON.stringify(Data.longEvent));
localStorage.setItem("2017-01-27S2017-01-30E", JSON.stringify(Data.repeatEventW));
localStorage.setItem("2017-03-14S2017-03-14E", JSON.stringify(Data.repeatEventM));
