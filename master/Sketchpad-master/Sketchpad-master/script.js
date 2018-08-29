var start = function(){
        $('#grid').html("");


        var input = prompt('Type an integer between 1 and 30');

        if (input >= 1 && input <= 30) {

            var $squarehw = $('.container').width()/input -2;

            for (var i = 0; i <= input; i++){
                for (var j = 1; j <= input; j++){
                    $('#grid').append('<div class="grid_sq"></div>');
                }
                $('#grid').append('<div class="new_row"></div>');
            }


            $('.grid_sq').height($squarehw);
            $('.grid_sq').width($squarehw);

            $('.grid_sq').hover(function(){
                $(this).addClass('blue');
            });
        }
};