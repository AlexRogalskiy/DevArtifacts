angular.module("AppName", [])
  .controller("AppController", ['$scope', '$sce', function($scope,$sce) {
    
    var animals = ["Antelope","Bear","Bison","Panther","Boar","Buffalo","Bull","Camel","Cat","Chimpanzee","Cobra","Crab","Crocodile","Deer","Dog","Donkey","Elephant","Fish","Fox","Frog","Goat","Hare","Hippopotamus","Horse","Hyena","Kangaroo","Leopard","Lion","Mare","Mongoose","Monkey","Mouse","Mule","Ox","Oyster","Pig","Porcupine","Prawn","Python","Rabbit","Ram","Rat","Reindeer","Rhinoceros","Shark","Sheep","Snake","Squirrel","Tiger","Tortoise","Viper","Wolf","Yak","Zebra"];

    $scope.guesses = 6;
    $scope.incorrectLetters = [];
    $scope.correctLetters = [];
    $scope.displayWord = '';
    $scope.input = {
      letter : ''
    };

    var selectRandomWord = function() {
      var index = Math.round(Math.random()*animals.length);
      return animals[index];
    };

    var newGame = function() {
      // Reset to default values
      $scope.guesses = 6;
      $scope.incorrectLetters = [];
      $scope.correctLetters = [];
      $scope.displayWord = '';

      // Create Game
      selectedWord = selectRandomWord();
      var censoredWord = '';
      for (var i = 0; i < selectedWord.length; i++) {
        censoredWord += '*';
      }
      $scope.displayWord = censoredWord;
    };

    $scope.letterChosen = function() {
      for (var i = 0; i < $scope.correctLetters.length; i++) {
        if ($scope.correctLetters[i].toLowerCase() == $scope.input.letter.toLowerCase()) {
            $scope.input.letter = '';
            return;
        }
      }
      
      for (var i = 0; i < $scope.incorrectLetters.length; i++) {
        if ($scope.incorrectLetters[i].toLowerCase() == $scope.input.letter.toLowerCase()) {
            $scope.input.letter = '';
            return;
        }
      }
      
      var correct = false;
      for (var i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i].toLowerCase() == $scope.input.letter.toLowerCase()) {
          $scope.displayWord = $scope.displayWord.slice(0,i) + $scope.input.letter.toLowerCase() + $scope.displayWord.slice(i+1);
          correct = true;
        }
      }
      if (correct) {
        $scope.correctLetters.push($scope.input.letter.toLowerCase());
      } else {
        $scope.guesses--;
        $scope.incorrectLetters.push($scope.input.letter.toLowerCase());
      }
      
      $scope.input.letter = '';
      
      if ($scope.guesses == 0) { 
        var game = "<p>You lost :(</p><button ng-click='letterChosen()'>Start New Game</button>";
        $scope.game = $sce.trustAsHtml(game);
      }
      if ($scope.displayWord.indexOf("*") == -1) { 
        var game = "<p>You won!</p><button ng-click='letterChosen()'>Start New Game</button>";
        $scope.game = $sce.trustAsHtml(game);
      }
    };

    newGame();

  }]);
