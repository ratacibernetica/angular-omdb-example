var moviesRoutes = require('server/movies/routes');
var movieRoutes = require('server/movie/routes');

module.exports = function routes(app){
	app.use('/movies', moviesRoutes);
	app.use('/movie', movieRoutes);
}
