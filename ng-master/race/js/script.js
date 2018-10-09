angular.module('scoreKeeper', [])
  .controller('score', ['$scope', function($scope) {

    $scope.gameInfo = {
      gameStarted: false,
      servesSinceSwitch: 0,
      scoreSwitchMode: 0,
      numberOfPlayers: 2
    }
    
    $scope.team1 = {
      name: "Team 1",
      score: 0,
      serving: false
    }
    $scope.team2 = {
      name: "Team 2",
      score: 0,
      serving: false
    }

    $scope.player1 = {
      name: "P1",
      serving: true
    }

    $scope.player2 = {
      name: "P2",
      serving: true
    }
    
    $scope.player3 = {
      name: null,
      serving: false
    }
    
    $scope.player4 = {
      name: null,
      serving: false
    }
    
    $scope.startGame = function() {$scope.gameInfo.gameStarted = true;}

    $scope.players = function(n) {
      $scope.gameInfo.numberOfPlayers = n;
      if (n == 2) {
        $scope.player3.name = null;
        $scope.player4.name = null;
      } else {
        $scope.player3.name = "P3";
        $scope.player4.name = "P4";
      }
      
    }
    
    $scope.addPoint = function(i) {
      // Start the game, give the Serving class to the person who won the rally
      if (!$scope.team1.serving && !$scope.team2.serving) {
        $scope['team' + i].serving = true;
        $scope.footer.message = "Game on!"
      } else {
        
        // Increment the player's score, how many serves since the last switch, and the highest current score
        $scope['team' + i].score++;
        $scope.gameInfo.servesSinceSwitch++;
        $scope.gameInfo.highestScore = Math.max($scope.team1.score, $scope.team2.score);
        
        // Echo who's in the lead or if it's tied
        if ($scope.team1.score > $scope.team2.score) {
          if ($scope.player3.name) {
              $scope.gameInfo.teamWithHighScore = $scope.team1.name;
            } else {
              $scope.gameInfo.teamWithHighScore = $scope.player1.name;
            }
          $scope.footer.message = $scope.gameInfo.teamWithHighScore + " is in the lead";
        } else if ($scope.team1.score < $scope.team2.score) {
          if ($scope.player3.name) {
              $scope.gameInfo.teamWithHighScore = $scope.team2.name;
            } else {
              $scope.gameInfo.teamWithHighScore = $scope.player2.name;
            }
          $scope.footer.message = $scope.gameInfo.teamWithHighScore + " is in the lead";
        } else if ($scope.team1.score == $scope.team2.score) {
          $scope.footer.message = "Game is tied";
        }
        
        if ($scope.team1.score == 10 && $scope.team2.score == 10) {
          $scope.gameInfo.scoreSwitchMode = 1;
        }
        
        // Figure out if serves are switching by 2
        if ($scope.gameInfo.servesSinceSwitch == 2 && $scope.gameInfo.scoreSwitchMode == 0) {
          $(".team").toggleClass("team__isServing");
          $scope.team1.serving = !$scope.team1.serving;
          $scope.team2.serving = !$scope.team2.serving;
          
          if ($scope.gameInfo.numberOfPlayers == 4) {
            if ($scope.team1.serving) {
              $scope.player1.serving = !$scope.player1.serving;
              $scope.player3.serving = !$scope.player3.serving;
            } else {
              $scope.player2.serving = !$scope.player2.serving;
              $scope.player4.serving = !$scope.player4.serving;
            }
          } 
          $scope.gameInfo.servesSinceSwitch = 0;
        
        // Or by 1
        } else if ($scope.gameInfo.scoreSwitchMode == 1) {
          $(".team").toggleClass("team__isServing");
          $scope.team1.serving = !$scope.team1.serving;
          $scope.team2.serving = !$scope.team2.serving;
          if ($scope.gameInfo.numberOfPlayers == 4) {
            if ($scope.team1.serving) {
              $scope.player1.serving = !$scope.player1.serving;
              $scope.player3.serving = !$scope.player3.serving;
            } else {
              $scope.player2.serving = !$scope.player2.serving;
              $scope.player4.serving = !$scope.player4.serving;
            }
          }
        }
        
        // Figure out if the game is over and who won
        if (Math.abs($scope.team1.score - $scope.team2.score) >= 2 && ($scope.gameInfo.highestScore >= 11)) {
          $(".scoreBoard").addClass("dimmed");
          $scope.footer.message = "Game over! " + $scope.gameInfo.teamWithHighScore + " wins!"
        }
      }
    }

    $scope.footer = {
      message: "Rally for serve"
    }
  }]);