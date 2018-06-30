/*

You will work with the following two variables.  The first, students, holds the names of four students.  
The second, scores, holds groups of test scores.  The relative positions of elements within the two 
variables match (i.e., 'Joseph' is the first element in students; his scores are the first value in scores.).

Do not alter the students and scores code.

*/

var students = ["Joseph", "Susan", "William", "Elizabeth"];

var scores = [ [80, 70, 70, 100],
               [85, 80, 90, 90],
               [75, 70, 80, 75],
               [100, 90, 95, 85] ];
               
               
               

/*

Below you will find driver code. Run the code in this file either from the command line using Node.js or 
by pasting the code of this entire file into your browser console.  All tests will log 'true' 
in the console when they pass--false, otherwise.

Follow the steps below to make the tests pass and complete the challenge.  The order of the steps 
corresponds to the order of the tests.  After completing each step, run your code to be certain 
that the next test has passed.
*/

// __________________________________________
// Write your code below.


// 1.  Create a variable average and assign it the value of a function ...
// 2.  that accepts an array of numbers and returns the average of those numbers.

var average  = function(numberArray) {
  var total = 0;
  
  for(i=0; i<numberArray.length; i++) {
    total += numberArray[i];
  }
  return total/numberArray.length;
};


// 3.  Create a variable gradebook and assign it the value of a new object.
var gradebook = {
// 6.  Add an addScore property to gradebook and assign it the value of a function ...
// 7.  that accepts name and score arguments and pushes the score to the value of the testScore property 
//     of the gradebook property that matches the value of the name argument.  For example, 
//     gradebook.addScore("Susan", 80) would push the score 80 into the value of gradebook.Susan.testScores.
  addScore: function(name, score){
     var temp = gradebook[name].testScores;
     return temp.push(score);
  },
// 8.  Add a getAverage property to gradebook and assign it the value of a function ...
// 9.  that accepts a name as a String (e.g., "Joseph") and returns the named students average.
  getAverage: function(name){
    return average(gradebook[name].testScores);
  },
// 4.  Make each student name in students a property of gradebook and assign each the value of a new object.
// 5.  Give each student property of gradebook its own testScores property and assign it the value 
//     of the respective students scores from scores.
  "Joseph": {testScores: scores[0]},
  "Susan": {testScores: scores[1]},
  "William": {testScores: scores[2]},
  "Elizabeth": {testScores: scores[3]}
};



// __________________________________________
// Driver Code:  Do not alter code below this line.


function assert(test, message, test_number) {
  if (!test) {
    console.log(test_number + "false");
    throw "ERROR: " + message;
  }
  console.log(test_number + "true");
  return true;
}

assert(
  (average instanceof Function),
  "The value of average should be a Function.\n",
  "1. "
);

assert(
  average([1, 2, 3]) === 2,
  "average should return the average of the elements in the array argument.\n",
  "2. "
);

assert(
  (gradebook instanceof Object),
  "The value of gradebook should be an Object.\n",
  "3. "
);

assert(
  (gradebook["Elizabeth"] instanceof Object),
  "gradebook's Elizabeth property should be an object.",
  "4. "
);

assert(
  (gradebook.William.testScores === scores[2]),
  "William's testScores should equal the third element in scores.",
  "5. "
);

assert(
  (gradebook.addScore instanceof Function),
  "The value of gradebook's addScore property should be a Function.",
  "6. "
);

gradebook.addScore("Susan", 80);

assert(
  (gradebook.Susan.testScores.length === 5
   && gradebook.Susan.testScores[4] === 80),
  "Susan's testScores should have a new score of 80 added to the end.",
  "7. "
);

assert(
  (gradebook.getAverage instanceof Function),
  "The value of gradebook's getAverage property should be a Function.",
  "8. "
);

assert(
  (gradebook.getAverage("Joseph") === 80),
  "gradebook's getAverage should return 80 if passed 'Jospeh'.",
  "9. "
);