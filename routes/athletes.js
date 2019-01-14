var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var Athlete = require('../models/athlete');

var multer=require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });









router.get('/alogin', function(req, res){
	Athlete.find().sort({ "username": 1 })
      .then(function(doc) {
	res.render('alogin', {layout: 'layout2.handlebars', items: doc});
});

});





router.post('/new',upload.single('profileimage'), function (req, res) {
	var username = req.body.username;
	
	var height = req.body.height;
	var weight = req.body.weight;
	var gender = req.body.gender;
	var sport = req.body.sport;
	var shank = req.body.shank;
	

	if(req.file) {
		console.log('Uploading File...');
		var profileimage = req.file.filename;
	} else {
		console.log('No File Uploded...');
		var profileimage = 'noimage.jpg';
	}
	

	// Validation
	req.checkBody('username', 'Name is required').notEmpty();
	req.checkBody('height', 'Height is required').notEmpty();
	req.checkBody('weight', 'Weight is required').notEmpty();
	req.checkBody('gender', 'Gender is required').notEmpty();
	req.checkBody('sport', 'Sport is required').notEmpty();
	req.checkBody('shank', 'Shank is required').notEmpty();
	
	

	var errors = req.validationErrors();



	if (errors) {
		res.render('new', {
			errors: errors
		});
	}
	else {
		
		Athlete.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, athlete) {
		if (athlete || athlete) {
					res.render('new', {
						athlete: athlete
						
					});
				}
			



				else {
					var newAthlete = new Athlete({
						username: username,
						profileimage: profileimage,
						
						height: height,
						weight: weight,
						gender: gender,
						sport: sport,
						shank: shank
						
					});
					Athlete.createathlete(newAthlete, function (err, athlete) {
						if (err) throw err;
						console.log(athlete);
					});
         	req.flash('success_msg', 'Athlete registered and can now login');
					res.redirect('/users/new');
				}
			
		});
	}
});

passport.use('athlete',new LocalStrategy(
	function (username, password, done) {
		Athlete.getAthleteByUsername(username, function (err, athlete) {
			if (err) throw err;
			if (!athlete) {
				return done(null, false, { message: 'Unknown User' });
			}

			Athlete.comparePassword(password, athlete.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, athlete);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));



passport.serializeUser(function (athlete, done) {
	done(null, athlete.id);
});

passport.deserializeUser(function (id, done) {
	Athlete.getAthleteById(id, function (err, athlete) {
		done(err, athlete);
	});
});

/*router.post('/alogin', 
    function(request, response, next) {
        console.log(request.session)
        passport.authenticate('athlete', 
        function(err, user, info) {
            if(!user){ response.send(info.message);}
            else{

                request.login(user, function(error) {
                    if (error) return next(error);
                    console.log("Request Login supossedly successful.");
                    console.log(user.username);
                    console.log(request.isAuthenticated());
                          return response.redirect('/feedback');
                });
                //response.send('Login successful');
            }

        })(request, response, next);
    }
); */


router.post('/alogin',
	passport.authenticate('athlete', { successRedirect: '/athlete/feedback/:username', failureRedirect: '/athletes/alogin', failureFlash: true }),
	function (req, res) {
		res.redirect('/athlete/feedback/:username');

	});




router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/athletes/alogin');
});







module.exports = router;