import angular from 'angular';
import uiRouter from 'angular-ui-router';
import todoFactory from 'factories/todo-factory';
import movieFactory from 'factories/movie-factory';
import todosController from 'todos/todos';
import moviesController from 'movies/movies';


const app = angular.module('app',[uiRouter,todoFactory.name, movieFactory.name]);

app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
	$urlRouterProvider.otherwise('/movies');

	$stateProvider
		.state('todos', {
			url: '/',
			template: require('todos/todos.html'),
			controller: todosController
		})
		.state('about', {
			url: "/about",
			template: require('about/about.html')
		})
		.state('movies', {
			url: "/movies?q&y&imdbID&page",
			template: require('movies/list.html'),
			controller: moviesController
		})
		.state('saved', {
			url: "/movies",
			template: require('movies/list.html'),
			controller: moviesController
		})
		.state('movie', {
			url: "/movie/:imdbID",
			template: require('movies/detail.html'),
			controller: moviesController
		})
		;

		$locationProvider.html5Mode(true);
});

export default app;