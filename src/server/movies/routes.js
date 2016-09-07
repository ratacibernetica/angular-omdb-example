var mongoose = require('mongoose');
var Movie = require('server/db/db').Movie;
var express = require('express');
var router = express.Router();


router.get('/list', function(req, res){
	console.log('index movies!');
	Movie.find(function(err, results){
		if(err){ console.log(err); }

		res.send({movies: results});
	}).limit(50);
});


router.post('/update', function(req, res){
	console.log('update movies!');
	console.log(req.body);
	var newMovies = req.body;
	console.log(newMovies);
	if(newMovies){
		Movie.collection.insert(newMovies, onInsert);

		function onInsert(err, docs) {
		    if (err) {
		        // TODO: handle error
		        console.log(err);
		        res.status(400);
				res.send({movies:[]});
		    } else{
	        	res.send({movies: docs.ops});	
		    }
		}
	}
});

/*
* Search by title
*/
router.get('/title', function(req, res){
	const q = req.query.q;
	const y = req.query.y;
	console.log(`searching ${q}...`);
	const query = {Title: new RegExp(q,'i')};
	if(y){
		query.Year = y;
	}
	Movie.find(query,function(err, results){
		if(err){ 
			console.log(err); 
			res.status(400);
			res.send({movies:[]});
		}

		res.send({movies: results});
	}).limit(1000);		

});


module.exports = router;