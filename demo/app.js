angular.module('app',['paginate','floatingHeaders','sortable'])


.controller('MainCtrl', ['$scope', 'contacts', '$pager', function ($scope,contacts,$pager) {

  $scope.contacts = [];
  $scope.pageSize = 50;
  $scope.pager = $pager;

  //$pager.setCurrentPage( 3 )


  /* initialization */
  +function init() {
    var setContacts = function(data) { return $scope.contacts = data; }
    return contacts.query().then(setContacts)
  }();

}])

// .controller('PageCtrl', ['$scope', '$pager', function ($scope, $pager) {
//   angular.extend($scope,$pager);
// }])

.service('contacts', ['$http',function ($http) {

  this.query = function() {
    var getResponseData = function(response) { return response.data; }
    return $http.get('../data/contacts.json').then(getResponseData)
  }

}])


