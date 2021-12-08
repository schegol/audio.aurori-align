//преобразование секунд в читабельный вид и обратно:
const transformSecondsToTime = function (s) {
    let h = Math.floor(s / 3600);
    let m = Math.floor(s / 60);

    s -= h * 3600;
    s -= m * 60;

    return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
}

const transformTimeToSeconds = function(string) {
    let timeArray = string.split(':'),
        s = 0,
        seconds = 0,
        minutes = 0,
        hours = 0;

    seconds = parseInt(timeArray.pop());
    s += seconds;

    if (timeArray.length) {
        minutes = parseInt(timeArray.pop());
        s += minutes * 60;
    }

    if (timeArray.length) {
        hours = parseInt(timeArray.pop());
        s += hours * 3600;
    }

    return s;
}

//бегущая строка:
const checkTextWidth = function () {
    let textLine = $('.controls__text'),
        textBox = $('.controls__text-box'),
        textWidth = textLine.outerWidth(),
        textBoxWidth = textBox.outerWidth(),
        widthDifference = textWidth - textBoxWidth,
        animationSpeedCoefficient = 200,
        animationDuration = Math.round(textWidth / animationSpeedCoefficient * 1000);

    if (textWidth > textBoxWidth) {
        textLine.addClass('controls__text--running');

        //анимация:
        function animationLoop () {
            textLine.css('left', '0');
            textLine.animate({
                left: -widthDifference
            },
            animationDuration,
            'linear',
            function () {
                setTimeout(function () {
                    animationReverseLoop();
                }, 800);
            });
        };
        function animationReverseLoop () {
            textLine.css('left', -widthDifference);
            textLine.animate({
                    left: 0
                },
                animationDuration,
                'linear',
                function () {
                    setTimeout(function () {
                        animationLoop();
                    }, 800);
                });
        };
        animationLoop();
    } else {
        textLine.removeClass('controls__text--running').attr('style', '').stop();
    }
};

//установка cookie:
const setCookie = function (cookieName, cookieValue = '') {
    $.cookie(cookieName, cookieValue, {
        expires: 365,
        path: '/;SameSite=Lax',
        secure: true,
    });
}

$(document).ready(function () {
    //подключение кастомной оболчки аудиоплеера:
    //TODO: попробовать подобрать альтернативный плеер

    let resetBtn = $('.controls__reset'),
        timeInput = $('.controls__input'),
        audioPlayer = $('.controls__audio');

    //сброс времени в input и связанного cookie:
    timeInput.val('');

    resetBtn.on('click', function () {
        let relatedCookieName = audioPlayer.data('cookie');

        timeInput.val('');

        if (relatedCookieName.length && $.cookie(relatedCookieName)) {
            setCookie(relatedCookieName);
        }
    });

    //маска на инпут времени:
    timeInput.inputmask({
        mask: '[9{0,3}]:59:59',
        definitions: {
            '5': {
                validator: "[0-5]",
                cardinality: 1
            }
        },
        'clearIncomplete': true,
        'greedy': false,
        showMaskOnHover: false,
    });

    //onblur обновляем cookie и добавляем 0 в часы, если ничего не введено:
    timeInput.on('blur', function () {
        let onBlurTimeArray = timeInput.val().split(':'),
            currentCookie = audioPlayer.attr('data-cookie');

        if (onBlurTimeArray.length === 3 && onBlurTimeArray[0] <= 0) {
            onBlurTimeArray[0] = '0';
            timeInput.val(onBlurTimeArray.join(':'));
        }

        if (currentCookie.length) {
            setCookie(currentCookie, transformTimeToSeconds(timeInput.val()));
            audioPlayer[0].currentTime = transformTimeToSeconds(timeInput.val());
        }
    });

    //обработка нажатия на запись из списка:
    let audioItems = $('.player-list__item-link'),
        textLine = $('.controls__text');

    audioItems.on('click', function (e) {
        e.preventDefault();

        //при переключении на другой трек во время воспроизведения текущего перед сменой обновим cookie:
        if (audioPlayer[0].paused === false) {
            let currentPlayTime = parseInt(audioPlayer[0].currentTime),
                currentCookie = audioPlayer.attr('data-cookie');

            setCookie(currentCookie, currentPlayTime);
        }

        //если выбранный трек уже играет, ничего не делаем:
        if ($(this).hasClass('player-list__item-link--selected'))
            return;

        //выделяем выбранный трек:
        audioItems.removeClass('player-list__item-link--selected');
        $(this).addClass('player-list__item-link--selected');

        let audioItemSrc = $(this).attr('href'),
            audioItemId = $(this).data('number'),
            audioItemText = $(this).text(),
            cookieName = clientIP + '_' + audioItemId;

        if (!$.cookie(cookieName)) {
            setCookie(cookieName);
            timeInput.val('');
        } else {
            timeInput.val(transformSecondsToTime($.cookie(cookieName)));
        }

        textLine.text(audioItemText);
        checkTextWidth();
        audioPlayer.attr('data-number', audioItemId);
        audioPlayer.attr('data-cookie', cookieName);
        audioPlayer.prop('src', audioItemSrc);
        // audioPlayer[0].play();

        //TODO: пока не работает с большими файлами (попробовать стриминг?):
        let playPromise = audioPlayer[0].play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                if ($.cookie(cookieName)) {
                    audioPlayer[0].currentTime = $.cookie(cookieName);
                }

                // audioPlayer[0].play();
            }).catch(error => {
                console.log(error);
                // sound.pause();
                audioPlayer[0].pause();
                //TODO: попробовать инициализировать перезапуск с этого места
            });
        }

        // var sound = new Howl({
        //     src: audioPlayer.attr('src'),
        //     html5: true
        // });
        // sound.play();
    });

    //обновление значения инпута и cookie по паузе:
    audioPlayer.on('pause', function () {
        let pauseSeconds = parseInt(audioPlayer[0].currentTime),
            pauseSecondsSef = transformSecondsToTime(pauseSeconds);

        if (audioPlayer[0].seeking === false) {
            timeInput.val(pauseSecondsSef);
            setCookie(audioPlayer.attr('data-cookie'), pauseSeconds);
        }
    });
});

$(window).on('load resize', function () {
    checkTextWidth();
});