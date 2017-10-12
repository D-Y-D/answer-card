$(function () {

    var s1 = '2017-10-10';
    var s2 = '2017-10-29';
    var now;

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
    var today;
    if (location.hash && location.hash.length == 11) {
        today = new Date(location.hash.slice(1));
    } else {
        today = new Date();
        now = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        today = new Date(now);
    }

    now = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var index = getDays(now, s2) + 1;

    var range = [0, number];
    var opt = {
        title: '廉洁从业学习',
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

    if (today < new Date(s1)) {
        opt.data = [];
    }

    opt.finishedcallback = function () {
        $('.btn-calendar').show();
    }

    $('#answer-card').answercard(opt);

    window.onload = function () {

        setTimeout(function () {
            $(".index_bg_welcome").fadeOut(1000, function () {
                $(".index_bg_welcome").remove();
            });
        }, 2000);
    }

    function getCalendarList() {
        var today = new Date(),
            dayStr,
            day,
            calendar = $('.calendar-list');

        for (var i = 0; i < total; i++) {
            day = new Date(s1);
            day.setDate(day.getDate() + i);

            if (day > today) {
                break;
            }
            dayStr = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
            calendar.append('<div>' + '<span  class="cal-item" data-value="' + dayStr + '" >' + dayStr + '</span></div>');
        }


        dayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        today = new Date(dayStr);
        if (today > new Date(s2)) {

            calendar.append('<div>' + '<span  class="cal-item" data-value="' + dayStr + '" >' + '随机抽题' + '</span></div>');
        }

        $('.calendar-list .cal-item').click(function () {
            var url = location.origin + location.pathname + '#' + $(this).attr('data-value');
            location.href = url;
            location.reload();
        });
    };

    getCalendarList();

    $('.btn-calendar').click(function () {

        $('#answer-card .question ,#answer-card .button-container , #answer-card .finish-container').hide();
        $('.btn-calendar').hide();
        $('.calendar-list').show();
    });

    if (location.hash) {

    } else {
        $('#answer-card .question ,#answer-card .button-container ').hide();
        $('.calendar-list').show();
    }

});