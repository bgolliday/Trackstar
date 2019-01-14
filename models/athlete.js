var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var AthleteSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},

	profileimage: { 
      
      type : String 
    },
	height: {
		type: Number
	},
	weight: {
		type: Number
	},
	gender: {
		type: String
	},

	sport: {
		type: String
	},
	shank: {
		type: Number
	}
});


var Athlete = module.exports = mongoose.model('Athlete', AthleteSchema);

module.exports.createathlete = function(newAthlete, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newAthlete.password, salt, function(err, hash) {
	        newAthlete.password = hash;
	        newAthlete.save(callback);
	    });
	});
}

module.exports.getAthleteByUsername = function(username, callback){
	var query = {username: username};
	Athlete.findOne(query, callback);
}

module.exports.getAthleteById = function(id, callback){
	Athlete.findById(id, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}