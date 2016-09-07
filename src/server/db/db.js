var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://'+process.env.MONGO_PORT_27017_TCP_ADDR+':'+process.env.MONGO_PORT_27017_TCP_PORT+'/todos');

var movieDetailsSchema = new Schema({
  Rated: String,
  Released: String,
  Runtime: String,
  Genre: String,
  Director: String,
  Writer: String,
  Actors: String,
  Plot: String,
  Language: String,
  Country: String,
  Awards: String,
  Metascore: String,
  imdbRating: String,
  imdbVotes: String,
  Type: String,
  Poster: String
});

var Movie = mongoose.model('Movie', {
	imdbID : 
	{ 
        type: String, 
        unique: true,
        index: true
    },
	Title : 
		{ 
	        type: String, 
	        index: true
	    },
	Year : { 
        type: String, 
        index: true
    },
	Type : { 
        type: String, 
        index: true
    },
	Poster : String,
	Details: movieDetailsSchema
});
module.exports.Movie = Movie;