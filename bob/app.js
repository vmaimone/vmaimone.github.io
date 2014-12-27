angular.module('app',['paginate','floatingHeaders'])


.controller('MainCtrl', ['$scope', 'contacts', function ($scope,contacts) {

  $scope.contacts = [];

  /* initialization */
  +function init() {
    var setContacts = function(data) { return $scope.contacts = data; }
    return contacts
              .query()
              .then(setContacts)
  }();

}])


.service('contacts', ['$http',function ($http) {

  this.query = function() {
    var getResponseData = function(response) { return response.data; }
    return $http.get('../sample.json').then(getResponseData)
  }

}])


