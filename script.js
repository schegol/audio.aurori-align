$(document).ready(function () {
    //сброс времени в input:
    let resetBtn = $('.controls__reset'),
        timeInput = $('.controls__input');

    resetBtn.on('click', function () {
        timeInput.val('');
    });
});

$(window).on('load resize', function () {
    //бегущая строка:
    let text = $('.controls__text'),
        textBox = $('.controls__text-box'),
        textWidth = text.outerWidth(),
        textBoxWidth = textBox.outerWidth();

    console.log(textWidth);

    if (textWidth > textBoxWidth) {
        text.addClass('controls__text--running');
    } else {
        text.removeClass('controls__text--running');
    }
});