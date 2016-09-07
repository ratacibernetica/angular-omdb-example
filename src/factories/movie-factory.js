import angular from 'angular';
import _ from 'lodash';

const movieFactory = angular.module('app.movieFactory',[])

.factory('movieFactory', ($http) => {

	function toggleSave($scope,movie){
		var test = localStorage.getItem('saved');
		$scope.saved = test ? test : [];
		$scope.saved  = JSON.parse(test);
		$scope.saved.push(movie);
		movie.isSaved = true;
		localStorage.setItem('saved', JSON.stringify($scope.saved));

		
	}

	function listSaved($scope){
		_initSaved($scope);
		console.log('fetching favorites');
		$scope.movies = $scope.saved;
	}

	function _initSaved($scope){
		console.log('init saved');
		
	}

	function getMovies($scope){
		$http.get('/movies/list').success(response => {
			$scope.totalResults = response.movies.length;
			$scope.movies = response.movies;
		});
	}

	function searchMovies($scope,$state,$params){
		
		if(!$scope.searchInput){ 
			$scope.page = 1;
			getMovies($scope);
			return;
		}

		$scope.typeIncludes = [];
    
	    $scope.includeType = function(type) {
	        var i = _.indexOf($scope.typeIncludes,type);
	        if (i > -1) {
	            $scope.typeIncludes.splice(i, 1);
	        } else {
	            $scope.typeIncludes.push(type);
	        }
	    }
	    
	    $scope.typeFilter = function(movie) {
	        if ($scope.typeIncludes.length > 0) {
	            if (_.indexOf($scope.typeIncludes, movie.Type) < 0)
	                return;
	        }
	        
	        return movie;
	    }

		// $scope.searchInput = sanitizer.sanitize(sanitizer.normalizeRCData($scope.searchInput));
		const q = $scope.searchInput;
		const y = $scope.searchInputYear;
		console.time('localsearch');
		$http.get(`/movies/title?q=${q}&y=${y}`)
		.success(response=>{
			$scope.movies = response.movies;
			// if(!response.movies.length || (response.movies.length && $scope.more)){
				console.timeEnd('localsearch');
				console.time('remotesearch');
				console.log('fetching from omdbapi...');
				fetchMovies($scope, ($scope,imdbResponse)=>{
					let newResults = imdbResponse.Search;
					console.log(`local itemCount ${$scope.movies.length} from ${imdbResponse.totalResults}`);
					$scope.totalRemoteResults = imdbResponse.totalResults;
					console.timeEnd('remotesearch');
					if($scope.movies.length < imdbResponse.totalResults){
						console.time('inserting');
						$scope.page = $scope.page+1;
						$scope.more = true;
						let newDocs = _.pullAllBy(newResults, $scope.movies ,'imdbID');
						console.log(newDocs);
						if(newDocs.length){
							console.log(`found ${newDocs.length} new movies, adding to local DB`);
							saveMovies($scope, newDocs);//
							console.timeEnd('inserting');
						}else{
							console.log('no new records found, trying to fetch more...');
							searchMovies($scope,$state,$params);
						}
					}else{
						$scope.page = 1;
						$scope.more = false;
					}
	    			$state.go('movies', {q: $scope.searchInput, y: $scope.searchInputYear});
				});
		}).error(response=>{
			console.log('could fetch from local database.');
		});
	}

	function fetchMovies($scope, callback){
		if(!$scope.searchInput){ return;}
		if(!$scope.page){$scope.page=1;}
		console.log(`searchind for "${$scope.searchInput}" at http://www.omdbapi.com/?s=${$scope.searchInput}&y=${$scope.searchInputYear}&page=${$scope.page}`);
		$http.get(`http://www.omdbapi.com/?s=${$scope.searchInput}&y=${$scope.searchInputYear}&page=${$scope.page}`)
		.success(response=>{
			if(response.Response === "True" && response.Search.length){
				callback($scope,response);
			}else{
				console.log('no results from omdbapi, returning local data');
				$scope.more = false;
			}
		}).error(response=>{
			console.log('could fetch from omdbapi');
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
		}).error(response=>{
			console.log('could fetch from local.');
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
			console.log('one');
			if(!$scope.movies.length){
				$scope.movies = response.movies;
				
			}else{
				$scope.movies = _.unionBy($scope.movies,response.movies,'imdbID');
			}
				console.log('two');
				if($scope.movies && $scope.movies.length)
					$scope.totalResults = $scope.movies.length;
			return;
		});
	}

	return {
		searchMovies,
		getMovies,
		fetchMovies,
		getMovieDetail,
		toggleSave,
		listSaved
	};
});

export default movieFactory;