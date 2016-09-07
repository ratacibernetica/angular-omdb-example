import angular from 'angular';
import _ from 'lodash';

const movieFactory = angular.module('app.movieFactory',[])

.factory('movieFactory', ($http) => {



	function toggleSave($scope,movie){
		_initSaved($scope);
		if(!movie.isSaved){
			movie.isSaved = true;
			$scope.saved.push(movie);
		}else{
			movie.isSaved = false;
			_.remove($scope.saved, o => { return o.imdbID === movie.imdbID; });
		}
		localStorage.setItem('saved', JSON.stringify($scope.saved));
	}

	function listSaved($scope){
		_initSaved($scope);
		$scope.movies = $scope.saved;
	}

	function _initSaved($scope){
		var test = localStorage.getItem('saved');
		try{
			$scope.saved  = JSON.parse(test);
			if(!$scope.saved.length){
				$scope.saved = [];
			}
		}catch(e){
			$scope.saved = [];
		}
	}

	function showFavorites($scope,$state){
		if(!$scope.showingFavorites){
			_initSaved($scope);
			$scope.movies = $scope.saved;
			$scope.showingFavorites = true;
		}else{
			$scope.showingFavorites = false;
			searchMovies($scope,$state);
		}
	}

	function _isID(someString){
		let regexp = new RegExp(/^tt\d+$/);
		return regexp.test(someString);
	}

	function getMovies($scope){
		$http.get('/movies/list').success(response => {
			$scope.totalResults = response.movies.length;
			$scope.movies = response.movies;
		});
	}

	function searchMovies($scope,$state){
		_initSaved($scope);
		if(!$scope.searchInput){ 
			$scope.page = 1;
			getMovies($scope);
			return;
		}

		$scope.typeIncludes = [];
    
    	//for filtering by movie.Type
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

		const q = $scope.searchInput;
		const y = $scope.searchInputYear;

		if(_isID(q)){ //if q looks like an imdbID
			$scope.filter = 'i';
			$state.go('movie', {imdbID: q});
		}else{
			$scope.filter = 's';
			$scope.searchUrl = `/movies/title?q=${q}&y=${y}`;
		}
		$http.get($scope.searchUrl )
		.success(response=>{
			$scope.movies = response.movies;
				fetchMovies($scope, ($scope,imdbResponse)=>{
					let newResults = imdbResponse.Search;
					$scope.totalRemoteResults = imdbResponse.totalResults;
					if($scope.movies.length < imdbResponse.totalResults){
						$scope.page = $scope.page+1;
						$scope.more = true;
						let newDocs = _.pullAllBy(newResults, $scope.movies ,'imdbID');
						if(newDocs.length){
							saveMovies($scope, newDocs);//
						}else{
							searchMovies($scope,$state);
						}
					}else{
						$scope.page = 1;
						$scope.more = false;
					}
	    			$state.go('movies', {q: $scope.searchInput, y: $scope.searchInputYear});
				});
		}).error(response=>{
			return;
		});
	}

	function fetchMovies($scope, callback){
		if(!$scope.searchInput){ return;}
		if(!$scope.page){$scope.page=1;}
		$http.get(`http://www.omdbapi.com/?${$scope.filter}=${$scope.searchInput}&y=${$scope.searchInputYear}&page=${$scope.page}`)
		.success(response=>{
			if(response.Response === "True" && response.Search.length){
				callback($scope,response);
			}else{
				$scope.more = false;
			}
		}).error(response=>{
			console.log('could fetch from omdbapi');
			return;
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
			return;
		});
			
	}

	function fetchMovieDetail($scope, imdbID){
		if(!imdbID){ return;}
			$http.get(`http://www.omdbapi.com/?i=${imdbID}&plot=full`)
			.success(response=>{
				if(response.Response === "True"){
					updateMovie($scope, response);//object with details
				}else{
					console.log('no results from omdbapi.');
				}
			})
			.error(response=>{
				return;
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
			if(!$scope.movies.length){
				$scope.movies = response.movies;
				
			}else{
				$scope.movies = _.unionBy($scope.movies,response.movies,'imdbID');
			}
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
		listSaved,
		showFavorites
	};
});

export default movieFactory;