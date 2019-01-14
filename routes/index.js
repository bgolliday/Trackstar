var express = require('express');
var router = express.Router();
var Athlete = require('../models/athlete');
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/loginapp';

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
	
	res.render('index', {layout: 'layout2.handlebars'});
});




router.get('/athlete/:username', function(req, res){
	Athlete.find({username: req.params.username})
	.then(function(docs) {
		res.render('profile', {items: docs} );
	});
			   	
});

router.get('/delete', function(req, res){
	res.render('delete', {layout: 'layout2.handlebars'});
});



router.get('/get-alpha', function(req, res, next) {
 Athlete.find().sort({ "username": 1 })
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});


router.get('/get-data', function(req, res, next) {
 Athlete.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-track', function(req, res, next) {
 Athlete.find({sport: 'Track&Field'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-basket', function(req, res, next) {
 Athlete.find({sport: 'Basketball'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-soccer', function(req, res, next) {
 Athlete.find({sport: 'Soccer'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-xcountry', function(req, res, next) {
 Athlete.find({sport: 'Cross Country'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-tennis', function(req, res, next) {
 Athlete.find({sport: 'Tennis'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-golf', function(req, res, next) {
 Athlete.find({sport: 'Golf'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-lacrosse', function(req, res, next) {
 Athlete.find({sport: 'Lacrosse'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-volley', function(req, res, next) {
 Athlete.find({sport: 'Volleyball'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-staff', function(req, res, next) {
 Athlete.find({sport: 'Staff'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-male', function(req, res, next) {
 Athlete.find({gender: 'male'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-female', function(req, res, next) {
 Athlete.find({gender: 'female'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});


router.get('/get-mbb', function(req, res, next) {
 Athlete.find({sport: 'Basketball', gender: 'male' } )
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-wbb', function(req, res, next) {
 Athlete.find({sport: 'Basketball', gender: 'female'})
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-mtennis', function(req, res, next) {
 Athlete.find({sport: 'Tennis', gender: 'male' } )
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-ftennis', function(req, res, next) {
 Athlete.find({sport: 'Tennis', gender: 'female' } )
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-mlacrosse', function(req, res, next) {
 Athlete.find({sport: 'Lacrosse', gender: 'male' } )
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-flacrosse', function(req, res, next) {
 Athlete.find({sport: 'Lacrosse', gender: 'female' } )
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});



router.get('/get-msoccer', function(req, res, next) {
 Athlete.find({sport: 'Soccer', gender: 'male' } )
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.get('/get-fsoccer', function(req, res, next) {
 Athlete.find({sport: 'Soccer', gender: 'female' } )
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});




      	

  

router.get('/athlete/feedback/:username',  function(req, res){
	Athlete.find({username: req.params.username})
	.then(function(docs) {
	res.render('feedback', {layout: 'layout3.handlebars', items:docs});
});


});


router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  Athlete.findByIdAndRemove(id).exec();
  res.redirect('/');
});





function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/home');
	}
}

module.exports = router;