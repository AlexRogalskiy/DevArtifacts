var express = require('express'),
    router = express.Router(),
    User = require('../models/user').User,
    path = require('path'),
    config = require('../config'),
    wrapper = require('../lib/wrapper');


/* GET users listing. */
router.get('/', function (req, res) {
    
    User.find({}, function (err, data) {
        if (err) {
            res.status(500).json(err);
            return;
        }                
        
        res.status(200).json(data.map(function (user) {            
            // Mongoose object is immutable, need to call toObject() method on mongoose object
            var temp_user = user.toObject();            
            temp_user.links = { self : config.get('host') + config.get('port') + '/users/' + user._id };
            return temp_user;
        }));
      
        //res.render('users', { users: data });
    });
});


/* GET get user. */
router.get('/:id', function (req, res) {    
    
    User.findById(req.params.id, function (err, data) {
        if (err) return res.status(500).json(err); 
        
        if (!data)
            return res.status(404).json({ message: "We didn't find a user with id: " + req.params.id }); 
        
        res.status(200).json(data);               
    });
});


/* POST create user */
router.post('/', function (req, res) {	
    
    if (req.body.name && req.body.password) {
        var user = new User(req.body);    
    	
        user.save(function (err, user) {
    		if (err) {
                res.status(500).json(err);
                return;
            }
            // set Location Header
            res.set('Location', config.get('host') + config.get('port') + '/users/' + user._id);
            res.status(201).json(user);            
    	});
    } else res.status(400).json( { error: 'name and password are required to create a new user.' } ); 
});


/* PUT update user */
router.put('/:id', function (req, res) {
    // User.findByIdAndUpdate(req.params.id, req.body, function (err) {
    //     if (err) throw err;
    //     res.json({ message: 'User updated' });
    // });
    User.findById(req.params.id, function (err, user) {        
        
        if (req.body.name) user.name = req.body.name;
        if (req.body.password) user.password = req.body.password;        
        
        user.save(function (err) {
            if (err) throw error;
            res.json( { message: "User updated" } );
        });
   });
});


/* DELETE user */
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, affected) {
        
        if (err) return res.status(500).json(err); 
        
        if (affected === null) 
            return res.status(404).json({ error: "We didn't find a movie with id: " + req.params.id });       
        
        res.set('Link', config.get('host') + config.get('port') + '/users; rel="collection"');
        res.status(204).end();
    });
});


module.exports = router;