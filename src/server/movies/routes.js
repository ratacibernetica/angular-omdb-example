var mongoose = require('mongoose');
var Movie = require('server/db/db').Movie;
var express = require('express');
var router = express.Router();


router.get('/list', function(req, res){
	console.log('index movies!');
	Movie.find(function(err, results){
		if(err){ console.log(err); }

		res.send({movies: results});
	}).sort({ Title: 1 });
});


router.post('/update', function(req, res){
	console.log('update movies!');
	var newMovies = req.body;

	if(newMovies){
		Movie.collection.insert(newMovies, onInsert);

		function onInsert(err, docs) {
		    if (err) {
		        // TODO: handle error
		        console.log(err);
		    } 
		    
	        console.info('%d movies were successfully stored.', docs.length);
	        res.send({movies: docs.ops});
		    
		}
	}
});

/*
* Search by title
*/
router.get('/title/:q', function(req, res){
	var q = req.params.q;
	console.log(`searching ${q}...`);
	Movie.find({Title: new RegExp(q,'i')},function(err, results){
		if(err){ console.log(err); }

		if(!results.length){
			console.log('no results');
		}
		res.send({movies: results});
	}).
	sort({ Title: 1 });		

});


module.exports = router;