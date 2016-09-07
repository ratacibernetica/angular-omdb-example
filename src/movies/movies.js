import _ from 'lodash';

export default function($scope, movieFactory, $stateParams){
	let params = {
		searchHasInput: false
	}

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
	if($stateParams.imdbID){
		movieFactory.getMovieDetail($scope,$stateParams.imdbID);
	}else{

		movieFactory.getMovies($scope);

		// $scope.onCompletedClick = todo => {
		// 	todo.isCompleted = !todo.isCompleted;
		// };

		// $scope.onEditClick = todo => {
		// 	todo.isEditing = true;
		// 	todo.updatedTask = todo.task;
		// };

		// $scope.onCancelClick = todo => {
		// 	todo.isEditing = false;
		// };

		const { searchMovies } = movieFactory;

		$scope.searchMovies = _.partial(searchMovies, $scope, params);
	}
}