         $(document).ready(function () {
           
            $.extend($.expr[':'], {
                unchecked: function (obj) {
                    return ((obj.type == 'checkbox' || obj.type == 'radio') && !$(obj).is(':checked'));
                }
            });

            $(".floral input:checkbox").change(function() {
                $(this).parent().next('ul').find('input:checkbox').prop('checked', $(this).prop("checked"));

                for (var i = $('.floral').find('ul').length - 1; i >= 0; i--) {
                    console.log(i);
                    $('.floral').find('ul:eq(' + i + ')').prev('label').find(' input:checkbox').prop('checked', function () {
                        
                        console.log($(this));
                        return $(this).parent().next('ul').find('input:unchecked').length === 0 ? true : false;
                    });
                }
            });
        });
   