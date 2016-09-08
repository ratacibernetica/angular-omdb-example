import angular from 'angular';
import uiRouter from 'angular-ui-router';
import movieFactory from 'factories/movie-factory';
import moviesController from 'movies/movies';


const app = angular.module('app',[uiRouter, movieFactory.name]);

app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
	$urlRouterProvider.otherwise('/movies');

	$stateProvider
		.state('about', {
			url: "/about",
			template: require('about/about.html')
		})
		.state('movies', {
			url: "/movies?q&y&imdbID&page",
			template: require('movies/list.html'),
			controller: moviesController
		})
		.state('movie', {
			url: "/movie/:imdbID",
			template: require('movies/detail.html'),
			controller: moviesController
		})
		.state('404', {
			url: "/404",
			template: "<div class='text-center alert alert-warning'>The programmer didn't have time to implement this, sorry :(</div>",
		})
		;

		$locationProvider.html5Mode(true);
});

export default app;