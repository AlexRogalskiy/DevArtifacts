angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html"
        }
      }
    })
    .state('eventmenu.checkin', {
      url: "/check-in",
      views: {
        'menuContent': {
          templateUrl: "templates/check-in.html",
          controller: "CheckinCtrl"
        }
      }
    })
    .state('eventmenu.attendees', {
      url: "/attendees",
      views: {
        'menuContent': {
          templateUrl: "templates/attendees.html",
          controller: "AttendeesCtrl"
        }
      }
    })

  $urlRouterProvider.otherwise("/event/home");
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.attendees = [{
    firstname: 'Nicolas',
    lastname: 'Cage'
  }, {
    firstname: 'Jean-Claude',
    lastname: 'Van Damme'
  }, {
    firstname: 'Keanu',
    lastname: 'Reeves'
  }, {
    firstname: 'Steven',
    lastname: 'Seagal'
  }];

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('CheckinCtrl', function($scope) {
  $scope.showForm = true;

  $scope.shirtSizes = [{
    text: 'Large',
    value: 'L'
  }, {
    text: 'Medium',
    value: 'M'
  }, {
    text: 'Small',
    value: 'S'
  }];

  $scope.attendee = {};
  $scope.submit = function() {
    if (!$scope.attendee.firstname) {
      alert('Info required');
      return;
    }
    $scope.showForm = false;
    $scope.attendees.push($scope.attendee);
  };

})

.controller('AttendeesCtrl', function($scope) {

  $scope.activity = [];
  $scope.arrivedChange = function(attendee) {
    var msg = attendee.firstname + ' ' + attendee.lastname;
    msg += (!attendee.arrived ? ' has arrived, ' : ' just left, ');
    msg += new Date().getMilliseconds();
    $scope.activity.push(msg);
    if ($scope.activity.length > 3) {
      $scope.activity.splice(0, 1);
    }
  };

})

.directive('slideAlong', function($timeout, $ionicSideMenuDelegate) {
  return  {
    link: function($scope, $element, $attrs) {
      $scope.$watch(function() {
        return $ionicSideMenuDelegate.getOpenRatio();
      }, function(ratio) {

        // retrieve the offset value from the offset attribute
        var offset = parseInt($attrs.offset);

        // set the new position
        var position = $attrs.side == 'left' ? (ratio * (offset * -1)) + (offset) : (ratio * (offset * -1) - offset);

        // we want to set the transition to 500ms (arbitrary) when 
        // clicking/tapping and 0ms when swiping
        $element[0].style.webkitTransition = (ratio === 0 || ratio === 1 || ratio === -1) ? '500ms' : '0ms';

        // we set the offset according to the current ratio
        $element[0].style.webkitTransform = 'translate3d(' + position + '%, 0, 0)';

      });
    }
  };
});