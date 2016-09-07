import angular from 'angular';
import _ from 'lodash';
import sanitizer from 'sanitizer';

const movieFactory = angular.module('app.movieFactory',[])

.factory('movieFactory', ($http) => {

	function getMovies($scope){
		$http.get('/movies/list').success(response => {
			$scope.totalResults = response.movies.length;
			$scope.movies = response.movies;
		});
	}

	function searchMovies($scope){
		if(!$scope.searchInput){ 
			$scope.counter = 0;
			getMovies($scope);
			return;
		}
		// $scope.searchInput = sanitizer.sanitize(sanitizer.normalizeRCData($scope.searchInput));
		var q = $scope.searchInput;
		$http.get(`/movies/title/${q}`)
		.success(response=>{
			// if(!response.movies.length || (response.movies.length && $scope.more)){
				console.log('fetching from omdbapi...');
				fetchMovies($scope,q);
			// }else{
			// 	$scope.movies  = response.movies;
			// }
		});
	}

	function fetchMovies($scope, q){
		if(!$scope.searchInput){ return;}
		if(!$scope.page){$scope.page=1;}
		console.log(`searchind for "${q}" at http://www.omdbapi.com/?s=${q}&page=${$scope.page}`);
		$http.get(`http://www.omdbapi.com/?s=${q}`)
		.success(response=>{
			if(response.Response === "True" && response.Search.length){
				$scope.totalResults = response.totalResults;
				saveMovies($scope ,response.Search);//array of movies
			}else{
				$scope.totalResults = 0;
				console.log('no results from omdbapi.');
				$scope.movies = [];
			}
		});
	}

	function getMovieDetail($scope, imdbID){
		if(!imdbID){ return;}
		$http.get(`/movie/detail/${imdbID}`)
		.success(response =>{
			if(response.movie){
				$scope.movieDetail = response.movie;
			}else{
				fetchMovieDetail($scope, imdbID);
			}
		});
			
	}

	function fetchMovieDetail($scope, imdbID){
		if(!imdbID){ return;}
		console.log(`searching details for "${imdbID}" at http://www.omdbapi.com/?i=${imdbID}&plot=full`);
			$http.get(`http://www.omdbapi.com/?i=${imdbID}&plot=full`)
			.success(response=>{
				if(response.Response === "True"){
					updateMovie($scope, response);//object with details
				}else{
					console.log('no results from omdbapi.');
				}
			})
			.error(response=>{
				console.log(response);
			})
			;
	}

	function updateMovie($scope, movieDetails){
		if(!movieDetails){ return;}
		console.log('updating movie details...');
		$http.post('/movie/updateDetails',{details: movieDetails})
		.success(response=>{
			console.log('success');
			$scope.movieDetail = response.movie;

		});
	}

	function saveMovies($scope,newMovies){
		if(!newMovies){ return;}
		console.log('new movies fetched, saving...');
		$http.post('/movies/update',newMovies)
		.success(response=>{
			$scope.movies = response.movies;
			$scope.counter = $scope.counter + $scope.movies.length;
			if($scope.counter <= $scope.totalResults){
				$scope.page = $scope.page+1;
				$scope.more = true;
			}else{
				$scope.more=false;
			}
			console.log(`showing ${$scope.movies.length} from ${$scope.totalResults}`);
		});
	}

	

	return {
		searchMovies,
		getMovies,
		fetchMovies,
		getMovieDetail
	};
});

export default movieFactory;