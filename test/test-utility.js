describe('Utility.js 테스트', function() {
    before(function() {
        // before suite
    });
    after(function() {
        // after suite
    });
    beforeEach(function() {
        // before test
    });
    afterEach(function() {
        // after test
    });
    describe('#padZero 테스트', function() {
        it('월이 한자리수일때 앞에 0을 붙여서 출력해야한다.', function(done) {
            var result = Utility.padZero(1, 2);
            if(result.length === 2) done();
            else throw Error('error');
        });
        it('월이 두 자리수일때 그대로 출력해야한다.', function(done) {
            var result = Utility.padZero(11, 2);
            if(result.length === 2) done();
            else throw Error('error');
        });
    });

    describe('element display 테스트', function() {
      before(function() {
        var box = document.createElement("div");
        box.setAttribute("id", "test-box");
        box.innerText = "I am a box";
        box.style.height = "100px";
        box.style.width = "100px";

        document.body.appendChild(box);
      });
      it('#hideElement 실행 시 display 속성이 none이 되어야 한다.', function(done) {
        ele = _$('#test-box');
        Utility.hideElement(ele);
        if (ele.style.display === "none") done();
        else throw Error('display is visible');
      });
      it('#showElement 실행 시 display 속성이 block이 되어야 한다.', function(done) {
        ele = _$('#test-box');
        Utility.showElement(ele);
        if (ele.style.display === "block") done();
        else throw Error('display is not block');
      });
      after(function() {
        var box = document.body._$('#test-box');
        document.body.removeChild(box);
      });
    });
    describe('#getTbodyFromThead 테스트', function () {
        before(function() {
            var div = document.createElement("div");
            div.setAttribute("id", "table-container");
            var html = '<table id = "test-table"><thead><tr><td></td><td id = "finder"></td><td></td></tr></thead>'
                     + '<tbody><tr><td></td><td></td></tr><tr><td></td><td id = "correct"></td></tr><tr><td></td><td></td></tr></tbody>';
            document.body.appendChild(div);
            _$('#table-container').innerHTML = html;
        });
        it('head의 td와 row를 넘겨주면 body의 해당하는 위치의 td를 돌려준다.', function(done) {
          var thead = _$("#test-table thead");
          var finder = thead._$("#finder");
          var row = 1;
          var result = Utility.getTbodyFromThead(thead, finder, row);
          if(result.getAttribute("id") === "correct") done();
          else throw Error('wrong body item');
        });
        after(function() {
            _$('#table-container').removeChild(_$("#test-table"));
        });
    });

});
