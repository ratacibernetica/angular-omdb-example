var mongoose = require('mongoose');
var Movie = require('server/db/db').Movie;
var express = require('express');
var router = express.Router();



router.get('/detail/:imdbID', function(req, res){
	var imdbIDNew = req.params.imdbID;
	console.log(`searching details for ${imdbIDNew}...`);
	Movie.findOne({imdbID: imdbIDNew, Details: {$ne:null}},function(err, doc){
		if(err){ console.log(err); }
		if(!doc){
			console.log('no details');
		}
		res.send({movie: doc});
	});		

});

router.post('/updateDetails', function(req, res){
	console.log('update movie details!');
	var movieDetails = req.body.details;

	if(movieDetails){
		Movie.findOneAndUpdate({imdbID: movieDetails.imdbID},{ Details: movieDetails},{upsert: true,new: true}, onUpdate);

		function onUpdate(err, doc) {
		    if (err) {
		        // TODO: handle error
		        console.log(err);
		    } else {
		    	if(!doc.Poster){
		    		doc.Poster = movieDetails.Poster;
		    	}
		    	doc.Details = movieDetails;
		    	console.log(doc);
		        console.info('%s successfully updated.',doc.imdbID);
		        res.send({movie: doc});
		    }
		}
	}
});

module.exports = router;