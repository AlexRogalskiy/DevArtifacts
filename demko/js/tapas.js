  $.fn.replaceText = function( search, replace, text_only ) {
    return this.each(function(){
      var node = this.firstChild,
        val,
        new_val,
        remove = [];
      if ( node ) {
        do {
          if ( node.nodeType === 3 ) {
            val = node.nodeValue;
            new_val = val.replace( search, replace );
            if ( new_val !== val ) {
              if ( !text_only && /</.test( new_val ) ) {
                $(node).before( new_val );
                remove.push( node );
              } else {
                node.nodeValue = new_val;
              }
            }
          }
        } while ( node = node.nextSibling );
      }
      remove.length && $(remove).remove();
    });
  };  
  
  jQuery.fn.removeHighlight = function() {
 return this.find("span.highlight").each(function() {
  with (this.parentNode) {
   replaceChild(this.firstChild, this);
  }
 }).end();
};

function highLight() { 
searchTerm = searchInput.val();
			searchRegex  = new RegExp(searchTerm, 'g');
			$("#container *").replaceText( searchRegex, '<span class="highlight">'+searchTerm+'</span>');
}

var searchInput = $("#keyword"), searchTerm, searchRegex;  
$("#apply-highlight").click(function(){highLight();});
//$("form").submit(function(){highLight();});
$("#remove-highlight").bind("click", function(){$("#container").removeHighlight();});

