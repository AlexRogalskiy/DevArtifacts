class Math2 {

//  Get random number between 2 given number
    static function getRandom(firstNumber:Number,lastNumber:Number):Number {
        return(Math.round(firstNumber + Math.random() * (lastNumber - firstNumber)));
    }

//  Get the center point between 2 given number
    static function getCenterPoint(firstNumber:Number,lastNumber:Number):Number {
        return((lastNumber - firstNumber) / 2);
    }

//  Get different random numbers between 0 and the number passed
    static function getRandomSeries(totalNumber) {

        var numberOfElements:Number;
        var myNumbers:Array;
        var randomNumbers:Array;
        var k;
        var thePosition:Number;

        numberOfElements = totalNumber;

        myNumbers = new Array(numberOfElements);
        randomNumbers = new Array(numberOfElements);

        for(k = 0; k < numberOfElements; k++){
            myNumbers[k] = k;
        }

        k = 0;

        while(myNumbers.length > 0){
            thePosition = Math.round(Math.random() * (myNumbers.length-1))
            randomNumbers[k] = myNumbers[thePosition];
            k++;
            myNumbers.splice(thePosition,1);
        }
        return(randomNumbers);
    }

}
