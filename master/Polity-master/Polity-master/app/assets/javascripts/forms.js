$(document).ready(function() {
    var table = $('#legislation-table').DataTable();
    $("#select-status").each(function(i) {
        var select = $('<select id="sort-select"><option value=""></option></select>')
        .appendTo($(this))
            .on('change', function() {
                table.column($('#select-status'))
                    .search('^' + $(this).val() + '$', true, false)
                    .draw();
            });

        table.column($('#select-status')).data().unique().sort().each(function(d, j) {
            select.append('<option value="' + d + '">' + d + '</option>')
        });
    });
});

$(document).ready(function() {
    $('#user_address_ward_id')
        .selectmenu()
        .selectmenu("menuWidget")
        .addClass("overflow");
});

$(document).ready(function() {
    $('#sort-select, #legislation-table_length label select')
        .selectmenu();
});
