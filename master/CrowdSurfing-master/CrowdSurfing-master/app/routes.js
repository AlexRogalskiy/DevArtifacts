module.exports = function(app, passport) {

    /**
     * public routes for survey-takers
     */

    /**
     * routes for login/logout/signup
     */

    // pages for login and signup
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    app.get('/register', function(req, res) {
        res.render('registration.ejs', { message: req.flash('signupMessage') });
    });

    // routes for signup and login
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/admin', 
        failureRedirect : '/register', 
        failureFlash : true 
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admin',
        failureRedirect : '/login',
	failureFlash    : true
    }));

    
    app.get('/admin', function(req, res) {
	res.render('home.ejs');
    });

};

// middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // carry on if user is authenticated in session, else redirect home
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
