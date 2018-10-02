/* 
  inspiration: https://css-tricks.com/responsive-data-table-roundup/
  
  adapTable.js by Joe Watkins
  
  steal this code!! :)
  
*/
(function($){
 
  $.fn.adapTable = function(options) {

    var defaults = {
      wrapper: this,
      wrappingElement: 'span',
      wrapingElementClass: 'adapTable-header'
    }
        
    var options =  $.extend(defaults, options);
    var o = options;
  
    var $table = o.wrapper,
        wrappingElement = o.wrappingElement,
        wrapingElementClass = o.wrapingElementClass; 

        $table.each(function(){

          var $tableHead = $(this).find('thead'),
              hasHeaders = $tableHead.length,
              headers = [];

              if(hasHeaders !== 0){
                $tableHead.find('th').each(function(){
                  headers.push($(this).text());
                });
                
                $(this).find('tr').not(':eq(0)').each(function(){
                  $(this).find('td').each(function(index,item){
                    $(this).prepend('<'+wrappingElement+' class="'+wrapingElementClass+'">'+headers[index]+':</'+wrappingElement+'>');
                  });
                }); 
              }

        });

  }; // $.fn

}(jQuery));


$('.adap-table').adapTable();