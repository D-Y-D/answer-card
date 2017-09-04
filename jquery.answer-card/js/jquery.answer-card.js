(function ($, window, undefined) {

    function AnswerCard($elem, opt) {
        //容器
        this.container = $elem;
        //图片路径
        this.imageUrl = opt.imageUrl || '';
        //题库数据
        this.data = opt.data;
        //主题
        this.title = opt.title;
        //当前的序号
        this.currentIndex = 0;
        //统计
        this.statistics = {
            pass: [],
            fail: [],
            notDone: []
        };
        //答题卡
        this._opt = {
            question: '',
            // checking radio multi
            type: 'radio',
            options: [],
            result: [],
            selected: [],
            explain: []
        };
        //浏览状态
        this.display = {
            question: true,
            explain: false,
            answer: true,
            browse: false,
        };
        //显示错误答题的时机
        this.fail = {
            instantly: false,
            end: true
        };
        //语言
        this.language = {
            "ok": "确定",
            "no_choice": "您还没选择！",
            'checking': '判断',
            'radio': '单选',
            'multi': '多选',
            'right_answers': '正确答案',
            'yes': "是",
            'no': "否"

        };
        //选项序号
        this.index = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
    }

    AnswerCard.prototype.create = function () {
        var container = this.container,
            title = this.createHeader(),
            question = this.createQuestion();
        explain = this.createExplain(),
            btn = this.createButton();

        container.append([title, question, explain, btn].join(''));
    }

    AnswerCard.prototype.createNext = function () {
        this.currentIndex = this.currentIndex + 1;

        var container = this.container,
            question = this.createQuestion(),
            explain = this.createExplain();

        container.find('.question,.explain').remove();
        container.find('header').after([question, explain].join(''));
    }

    AnswerCard.prototype.createHeader = function () {
        var title = ['<header>',
            '<div class="title">',
            this.title,
            '</div>',
            '</header>'
        ].join('');

        return title;
    }

    AnswerCard.prototype.createQuestion = function () {
        var data = this.data,
            question,
            item = $.extend(true, {}, this._opt, data[this.currentIndex]),
            type = this.language[item.type || 'radio'];

        data[this.currentIndex] = item;

        if (!this.display.question) {
            return "";
        }

        question = ['<div class="question">',
            '<div class="question-content">',
            '<p class="question-subject">', this.currentIndex + 1, '.', '[', type, ']', item.question, '</p>',
            this.createQuestionOptions(item.type, item.options),
            '</div>',
            '</div>'
        ].join('');

        return question;
    }

    AnswerCard.prototype.createQuestionOptions = function (type, data) {

        var options = [],
            item,
            index = this.index;

        if (type === 'checking') {
            data = [this.language.yes, this.language.no];
        }

        for (var i = 0, len = data.length; i < len; i++) {
            item = data[i];
            options.push('<p class="question-option" data-index="' + i + '">' +
                '<span class="option-check"></span>' +
                '<label for="">' + index[i] + '.' + item + '</label>' +
                '</p>');
        }

        return options.join('');
    }

    AnswerCard.prototype.createExplain = function () {
        var data = this.data,
            explain,
            item = data[this.currentIndex];


        if (!this.display.explain) {
            return "";
        }

        explain = ['<div class="explain">',
            '<div class="explain-content">',
            '<p class="explain-subject">', this.language['right_answers'], '：', '</p>',
            this.createExplainContent(item.explain),
            '<span class="stamp right"></span>',
            '</div>',
            '</div>'
        ].join('');

        return explain;
    }

    AnswerCard.prototype.createExplainContent = function (data) {
        var content = [],
            item;

        for (var i = 0, len = data.length; i < len; i++) {
            item = data[i];
            content.push('<p>' + item + '</p>');
        }

        return content.join('');
    }

    AnswerCard.prototype.createGrade = function () {

        var container = this.container,
            singleGrade = Math.ceil(100 / this.data.length),
            total = singleGrade * this.statistics.pass.length || 0,
            grade;
        debugger;

        if (!total || isNaN(total)) {
            total = '000';
        }

        if (total >= 100) {
            total = '100';
        }

        if (total < 10) {
            total = '00' + total;
        } else if (total < 100) {
            total = '0' + total;
        }

        grade = ['<div class="grade">',
            '<div class="grade-img">',
            '<img src="', this.imageUrl, total[0], 'f.png', '" />',
            '<img src="', this.imageUrl, total[1], 'f.png', '" />',
            '<img src="', this.imageUrl, total[2], 'f.png', '" />',
            '</div>',
            '</div>'
        ].join('');

        container.find('.question,.explain').remove();
        container.find('header').after([grade].join(''));
    }

    AnswerCard.prototype.createButton = function () {

        var btn = ['<div class="button-container">',
            '<div class="button-msg">', this.language['no_choice'], '</div>',
            '<div class="button-ok">', '<a>', this.language['ok'], '</a>', '</div>',
            '</div>'
        ].join('');

        return btn;
    }

    AnswerCard.prototype.toggleQuestionOption = function ($elem) {
        var question = this.data[this.currentIndex],
            self = this;

        if ($elem.hasClass('quest-option-selected')) {
            this.cancelQuestionOption($elem);
        } else {
            this.selectQuestionOption($elem);
        }

        if (question.type !== 'multi') {
            $elem.siblings().each(function () {
                self.cancelQuestionOption($(this));
            });
        }
    }

    AnswerCard.prototype.selectQuestionOption = function ($elem) {
        $elem.addClass('quest-option-selected');
    }

    AnswerCard.prototype.cancelQuestionOption = function ($elem) {
        $elem.removeClass('quest-option-selected');
    }

    AnswerCard.prototype.markingQuestion = function (index) {
        debugger;
        var question = this.data[index],
            result = question.result.toString(),
            selected = question.selected.toString();

        if (!selected) {
            this.statistics.notDone.push(index);
        } else if (result === selected) {
            this.statistics.pass.push(index);
        } else {
            this.statistics.fail.push(index);
        }
    }

    AnswerCard.prototype.getQuestionSelectedOption = function () {
        var question = this.data[this.currentIndex],
            $elem = this.container,
            self = this;

        $elem.find('.quest-option-selected').each(function () {
            var index = $(this).index();
            if (index !== -1) {
                question.selected.push(self.index[index - 1]);
            }
        });
    }

    AnswerCard.prototype.showButtonMessage = function (text) {
        var $elem = this.container.find('.button-msg');
        $elem.text(text).show();
    }

    AnswerCard.prototype.hideButtonMessage = function () {
        var $elem = this.container.find('.button-msg');
        $elem.hide();
    }

    AnswerCard.prototype.getCurrentQuestion = function () {
        return this.data[this.currentIndex];
    }




    var methods = {
        init: function (options) {
            return this.each(function () {
                var $elem = $(this),
                    answercard = $elem.data('answer-card');

                //初始化
                if (answercard) {
                    this.destroy();
                }

                answercard = new AnswerCard($elem, options);
                $elem.addClass('answer-card-container').data('answer-card', answercard);
                answercard.create();
                // 取消默认的右键菜单
                this.oncontextmenu = function () {
                    return false;
                };

                //绑定问题选项事件
                $elem.on('click', '.question-option', function () {
                    var $elem = $(this);
                    answercard.toggleQuestionOption($elem);
                });

                //绑定按钮事件
                $elem.on('click', '.button-ok', function () {

                    answercard.getQuestionSelectedOption();
                    answercard.markingQuestion(answercard.currentIndex);

                    if (answercard.getCurrentQuestion().selected.length === 0) {
                        answercard.showButtonMessage(answercard.language['no_choice']);
                    } else {
                        answercard.hideButtonMessage();
                        if (answercard.currentIndex + 1 >= answercard.data.length) {
                            //评分界面
                            answercard.createGrade();
                        } else {
                            //下一题
                            answercard.createNext();
                        }
                    }
                })

            });
        },
        destroy: function () {
            return this.each(function () {
                var $elem = $(this);
                $elem.removeClass('answer-card-container');
                $elem.removeData('answer-card');
                $elem.empty();
            });
        }
    };

    jQuery.fn.answercard = function () {
        var method = arguments[0],
            arg = arguments;

        if (methods[method]) {
            method = methods[method];
            arg = Array.prototype.slice.call(arguments, 1);
        } else if (typeof (method) === 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.menubar');
            return this;
        }

        return method.apply(this, arg);
    };

})(jQuery, window, undefined);