import Mock from 'mockjs';
var baseUrl = 'http://t.com';

//login -------------------------
Mock.mock(baseUrl + '/api', function(opt) {
    var param = sessionStorage.getItem(opt.url);
    return {
        error: '1',
        msg: '登录失败',
        data: {}
    }
});
