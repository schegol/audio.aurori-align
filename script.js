$(document).ready(function () {
    let resetBtn = $('.controls__reset'),
        timeInput = $('.controls__input');

    resetBtn.on('click', function () {
        timeInput.val('');
    })
})