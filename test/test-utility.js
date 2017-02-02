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
      it('#hideElement 실행 시 display 속성이 none이 되어야 한다.', function(done) {
        ele = _$('#box');
        Utility.hideElement(ele);
        if (ele.style.display === "none") done();
        else throw Error('display is visible');
      });
      it('#showElement 실행 시 display 속성이 block이 되어야 한다.', function(done) {
        ele = _$('#box');
        Utility.showElement(ele);
        if (ele.style.display === "block") done();
        else throw Error('display is not block');
      });
    });
});
