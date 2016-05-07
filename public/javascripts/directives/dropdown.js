app.directive('dropdown', ['$document', function($document) {
  return {
  	restrict: 'A',
    templateUrl: 'partials/directives/dropdown.html',
    scope: true, // Makes the scope available for the directive
  };
}]);