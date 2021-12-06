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

    s += seconds = parseInt(timeArray.pop());
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
        textBoxWidth = textBox.outerWidth();

    if (textWidth > textBoxWidth) {
        textLine.addClass('controls__text--running');
    } else {
        textLine.removeClass('controls__text--running');
    }
};

//очистка cookie:
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

    //сброс времени в input и связанного cookie:
    let resetBtn = $('.controls__reset'),
        timeInput = $('.controls__input'),
        audioPlayer = $('.controls__audio');

    resetBtn.on('click', function () {
        let relatedCookieName = audioPlayer.data('cookie');

        timeInput.val('');

        if (relatedCookieName.length && $.cookie(relatedCookieName)) {
            setCookie(relatedCookieName);
        }
    });

    //обработка нажатия на запись из списка:
    let audioItems = $('.player-list__item-link'),
        textLine = $('.controls__text');

    audioItems.on('click', function (e) {
        //TODO: при переключении на другой трек во время воспроизведения текущего перед сменой обновить cookie

        e.preventDefault();
        if ($(this).hasClass('player-list__item-link--selected'))
            return;

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

        //TODO: пока не работает с большими файлами:
        let playPromise = audioPlayer[0].play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                if ($.cookie(cookieName)) {
                    audioPlayer[0].currentTime = $.cookie(cookieName);
                }
                audioPlayer[0].play();
            }).catch(error => {
                console.log(error);
                audioPlayer[0].pause();
            });
        }
    });

    audioPlayer.on('pause', function () {
        let pauseSeconds = parseInt(audioPlayer[0].currentTime),
            pauseSecondsSef = transformSecondsToTime(pauseSeconds);

        timeInput.val(pauseSecondsSef);
        setCookie(audioPlayer.attr('data-cookie'), pauseSeconds);
    });
});

$(window).on('load resize', function () {
    checkTextWidth();
});