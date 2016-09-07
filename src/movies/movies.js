import _ from 'lodash';

export default function($scope, movieFactory, $stateParams, $log, $state){
	let params = {
		searchHasChanged: false
	}

	if($state)

	$scope.more = false;
	$scope.counter = 0;

	$scope.checkImage = img => {
		if(img === 'N/A'){
			return 'http://moln.us/images/movie-poster.jpg';
		}else{
			return img;
		}
	}

	$scope.$watch('movieDetail', function() {
	        console.log('hey, movie has changed!');
	        console.log($scope.movieDetail);
	    });

	$scope.$watch('searchInput', function() {
	        console.log('new search...');
	        $scope.page=1;
	        $scope.more = false;
	    });

	$scope.$watch('movies', function() {
		if($scope.movies && $scope.movies.length){
	        $scope.totalResults = $scope.movies.length;
	    	$scope.types = _.uniq(_.map($scope.movies, 'Type'));
		}
	    else
	    	$scope.totalResults = 0;
	    	$scope.totalRemoteResults = 0;
	    });

	if($stateParams.imdbID){
		movieFactory.getMovieDetail($scope,$stateParams.imdbID);
	}else{

		//movieFactory.getMovies($scope);

		const { searchMovies, toggleSave } = movieFactory;

		$scope.toggleSave = _.partial(toggleSave, $scope);
		$scope.searchMovies = _.partial(searchMovies, $scope, $state,params);
		$scope.searchInput = $stateParams.q;
		$scope.searchInputYear = $stateParams.y?$stateParams.y:'';
		$scope.page = $stateParams.page;
		if($scope.searchInput){
			$scope.searchMovies();
		}
	}
}