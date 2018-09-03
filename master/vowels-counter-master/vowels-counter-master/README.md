# vowels-counter

Java program that loads all words and determines the average number of vowels per word.
Result is written to the output file. 

Example: 

INPUT

The time traveller.


OUTPUT 

({a, e}, 9) -> 3.0,
({e, i}, 4) -> 2.0,
({e}, 3) -> 3.0

# usage 
mvn clean install 

in catalog /target find vowels-counter.jar

java -jar vowels-counter.jar C:\INPUT.TXT C:\OUTPUT.TXT

[E, O], 5=1.875
[A, a, i], 5=1.0
[u], 7=3.5

# using beautifying property

run application with optional third args = true to decorate (beautify) result. 
But keep in mind that beautifying costs additional time. 
As for example processing time of 3500 lines of text file took 180 milliseconds in compare to 80 milliseconds in default mode. 

java -jar vowels-counter.jar C:\INPUT.TXT C:\OUTPUT.TXT true

({E, O}, 5) -> 1.875
({A, a, i}, 5) -> 1.0
({u}, 7) -> 3.5

