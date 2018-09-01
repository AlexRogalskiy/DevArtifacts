jQuery( function( $ ) {
    $( 'form' ).submit( function() {
        urlPath = $( '#url' ).val();
        parsedUrl = parse_url( urlPath );
        var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20'" + encodeURIComponent( urlPath ) + '\'&format=json&diagnostics=true&callback=processYqlResults', yqlScript = document.createElement( 'script' );
        yqlScript.src = url;
        document.head.appendChild( yqlScript );
        return false;
    });
});

var urlPath = '', parsedUrl = {};

function processYqlResults( result ) {
    //logThis( describe( result ) );
    getImages( result );
}

function logThis( thisString ) {
    $( '#results' ).append( thisString );
}

function describe( obj ) {
    var desc = '<ul>';
    for( var i in obj ) {
        if( typeof obj[ i ] == 'object' ) {
            desc += '<li><b>' + i + '</b> : ' + describe( obj[ i ] ) + '</li>';
        } else {
            desc += '<li><b>' + i + '</b> : ' + obj[ i ] + '</li>';
        }
    }
    return desc + '</ul>';
}

function getImages( htmlObj ) {
    for( var i in htmlObj ) {
        if( i == 'img' ) {
            if( htmlObj[ i ].src ) {
                var src = htmlObj[ i ].src;
                if( src.substr( 0, 4 ) != 'http' ) {
                    if( src.substr( 0, 2 ) == '//' ) {
                        src = parsedUrl.scheme + ':' + src;
                    } else if( src.substr( 0, 1 ) == '/' ) {
                        src = parsedUrl.scheme + '://' + parsedUrl.host + src;
                    } else {
                        src = parsedUrl.scheme + '://' + parsedUrl.host + '/' + src;
                    }
                }
                if( $( 'img[src="' + src + '"]' ).length == 0 ) {
                    logThis( '<div style="outline:1px solid #333"><p><img src="' + src + '"' + ( htmlObj[ i ].alt ? ' alt="' + htmlObj[ i ].alt + '"' : '' ) + ( htmlObj[ i ].title ? ' title="' + htmlObj[ i ].title + '"' : '' ) + ' /></p><p><em>' + src + '</em></p></div>' );
                }
            }
            return false;
        }
        if( typeof htmlObj[ i ] == 'object' ) {
            getImages( htmlObj[ i ] );
        }
    }
}