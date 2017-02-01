var Data = {
    manyEvent : [{
        "title": "제목1",
        "place": "장소1",
        "desc": "설명1",
        "start": "2017-01-04T16:07:00Z",
        "end": "2017-01-04T17:07:00Z",
        "allDay": false,
        "repeat": "none"
    }, {
        "title": "제목2",
        "place": "장소2",
        "desc": "설명2",
        "start": "2017-01-04T16:08:00Z",
        "end": "2017-01-04T17:08:00Z",
        "allDay": true,
        "repeat": "W"
    }, {
        "title": "제목3",
        "place": "장소3",
        "desc": "설명3",
        "start": "2017-01-04T18:08:00Z",
        "end": "2017-01-04T22:08:00Z",
        "allDay": false,
        "repeat": "none"
    }],
    longEvent : [{
        title: "1/24~2/7",
        start: "2017-01-24T00:00:00Z",
        end: "2017-02-07T01:59:00Z",
        allDay: "false",
        repeat: "none",
        place: "where",
        desc: "dddddd"
    }],
    repeatEventW : [{
        title: "12/6: 화수목 매주반복",
        start: "2016-12-06T00:00:00Z",
        end: "2016-12-08T02:59:00Z",
        allDay: "false",
        repeat: "W",
        place: "where",
        desc: "dddddd"
    }],
    repeatEventM : [{
        title: "매월1일",
        start: "2017-01-01T00:00:00Z",
        end: "2017-01-01T02:59:00Z",
        allDay: "false",
        repeat: "M",
        place: "where",
        desc: "dddddd"
    }],
};

localStorage.setItem("2017-01-04S2017-01-04E", JSON.stringify(Data.manyEvent));
localStorage.setItem("2017-01-24S2017-02-07E", JSON.stringify(Data.longEvent));
localStorage.setItem("2016-12-06S2016-12-08E", JSON.stringify(Data.repeatEventW));
localStorage.setItem("2017-01-01S2017-01-01E", JSON.stringify(Data.repeatEventM));
