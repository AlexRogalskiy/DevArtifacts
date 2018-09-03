# vowel-avg
Given the supplied text file (input.txt is attached), write a Java program that loads all words and determines the average number of vowels per word grouped by: set of vowels present in a word and length of the word. The result should be written to the output file (output.txt).

Example:

INPUT

Platon made bamboo boats.

OUTPUT

({a, o}, 6) -> 2.5
({a, o}, 5) -> 2
({a, e}, 4) -> 2

# vowels
A, E, I, O, U, and sometimes Y
In this task Y is considered as consonant

 - To run : mvn clean install exec:java
 - To run test : mvn clean test
 - package : mvn clean package

After running you need to enter absolute path to input file
