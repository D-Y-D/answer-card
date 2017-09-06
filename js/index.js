$(function () {

    var s1 = '2017-09-6';
    var s2 = '2017-09-7';

    function getDays(start, end) {
        var s1 = new Date(start.replace(/-/g, "/"));
        var s2 = new Date(end.replace(/-/g, "/"));

        var days = s2.getTime() - s1.getTime();
        var time = parseInt(days / (1000 * 60 * 60 * 24))
        return time;
    }
    //周期
    var total = getDays(s1, s2) + 1;
    // 每次选取个数
    var number = Math.ceil(data.length / total);
    //今天的日期
    var today = new Date();
    s1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var index = getDays(s1, s2) + 1;

    var range = [0, number];
    var opt = {
        title: '党建学习',
        imageUrl: './jquery.answer-card/images/red/',
        data: data
    };
    if (index >= 0) {
        offset = total - index;
        if ((range[1] + offset * number) > data.length) {
            opt.random = true;
        } else {
            range[0] = range[0] + offset * number;
            range[1] = range[1] + offset * number;
            opt.range = range;
        }

    } else {
        opt.random = true;
    }

    if (opt.random) {
        opt.range = [0, 30];
    }

    $('#answer-card').answercard(opt);
});