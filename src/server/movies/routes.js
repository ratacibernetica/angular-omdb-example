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
		    } 
	        console.info('%d movies were successfully stored.', docs);
	        res.send({movies: docs.ops});
		    
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
		if(err){ console.log(err); }

		res.send({movies: results});
	}).limit(1000);		

});

// router.get('/:q', function(req, res){
// 	var q = req.params.q;
// 	console.log(`searching via parameter ${q}...`);
// 	Movie.find({Title: new RegExp(q,'i')},function(err, results){
// 		if(err){ console.log(err); }

// 		res.send({movies: results});
// 	}).limit(10);		

// });

// router.get('/?q', function(req, res){
// 	var q = req.query.q;
// 	console.log(`searching via parameter 2 ${q}...`);
// 	Movie.find({Title: new RegExp(q,'i')},function(err, results){
// 		if(err){ console.log(err); }

// 		res.send({movies: results});
// 	}).limit(10);		

// });


module.exports = router;