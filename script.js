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

$(document).ready(function () {
    //сброс времени в input:
    let resetBtn = $('.controls__reset'),
        timeInput = $('.controls__input'),
        audioPlayer = $('.controls__audio');

    resetBtn.on('click', function () {
        timeInput.val('');
        //TODO: дописать очистку значения cookie после того, как заработает назначение data-атрибутов плееру
    });

    //обработка нажатия на запись из списка:
    let audioItems = $('.player-list__item-link'),
        textLine = $('.controls__text');

    audioItems.on('click', function (e) {
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
            $.cookie(cookieName, '', {
                expires: 365,
                path: '/'
            });
            timeInput.val('');
        } else {
            timeInput.val($.cookie(cookieName));
        }

        textLine.text(audioItemText);
        checkTextWidth();
        audioPlayer.data('number', audioItemId); //TODO: пока не работает
        audioPlayer.data('cookie', cookieName); //TODO: пока не работает
        audioPlayer.prop('src', audioItemSrc);
        // audioPlayer[0].play();

        //TODO: пока не работает:
        let playPromise = audioPlayer[0].play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                //TODO: воспроизведение со времени, указанного в инпуте
                audioPlayer[0].play();
            }).catch(error => {
                console.log(error);
                audioPlayer[0].pause();
            });
        }
    });

    //TODO: обновление cookie по паузе
});

$(window).on('load resize', function () {
    checkTextWidth();
});