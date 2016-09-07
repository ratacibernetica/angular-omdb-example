var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/todos');

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
  Type: String
});


var Todo = mongoose.model('Todo', {
	task: String,
	isCompleted: Boolean,
	isEditing: Boolean
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

module.exports.Todo = Todo;
module.exports.Movie = Movie;