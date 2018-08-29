//in app.js, instead of requiring passport directly, we'll require our module right her
//import the core module
var passport = require('passport'),
	//import local passport
	LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
	//return done on successful login
    function(username, password, done) {
        //query the db. Username gets stored in the session
        if (username === 'admin' && password === 'lynda') {
            return done(null, {
                username: "admin"
            });
        }

        return done(null, false);
    }
));

//take the use obj info and store it in the sesson
passport.serializeUser(function(user, done) {
    done(null, false);
});

//take the user objet out of the session and check if the session is still valid
passport.deserializeUser(function(username, done) {
    done(null, {
        username: username
    });
});

//feed the main app file the core passport modile since it's less messy this way
module.exports = passport;
