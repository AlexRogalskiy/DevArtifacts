// user.create.js
var resultEL = document.getElementById( 'result' );
document.addEventListener( 'user/create', function ( event ) {
    resultEL.innerHTML = event.detail.username;
} );


//another.js
document.addEventListener( 'user/create', function (event ) {
    alert( 'Hey OttawaJS, ' + event.detail.username + ' says hi!');
})

// user.js
// ul#flintstones
var el = document.getElementById( 'flintstones' );
el.addEventListener( 'click', function ( event ) {
    var user = event.target.innerHTML;
    var customEvent = new CustomEvent( 'user/create', {
        detail: {
            username: user
        }
    });
    document.dispatchEvent( customEvent );
}, false );