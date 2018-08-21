$(document).ready(function () {
    $('#check').click(function () {

        $.getJSON('rest/status', function (data) {
            var json = JSON.stringify(data, null, 4);

            $('#output').html(json);
        });

    });

    $('#clear').click(function () {
        $('#output').html('');
    });
});