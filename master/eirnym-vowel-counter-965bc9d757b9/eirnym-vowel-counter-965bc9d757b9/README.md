**Description**

Given the supplied text file, write a Java program that loads all words and determines the average number of vowels per word grouped by: set of vowels present in a word and length of the word. Result should be written to the output file.
 
Example:
 
**INPUT**:
 
`Platon made bamboo boats.`
 
**OUTPUT**:

```
({a, o}, 6) -> 2.5
({a, o}, 5) -> 2
({a, e}, 4) -> 2
```

Usage:

**Build**:
```
./gradlew clean build
```
You should use `gradlew.bat` if you run on Windows.

**Run tests:**

```
./gradlew test
```

You should use `gradlew.bat` if you run on Windows.

**Run application:**
```
java -jar app/build/libs/app-1.0-SNAPSHOT.jar input output
```

Arguments description:

`input` — filename to read.
  * If argument is missing or empty, "input.txt" will be used.
  * If argument is "-", standard input will be used.

`output` — filename to write.
  * If argument is missing or empty, "output.txt" will be used.
  * If argument is "-", standard output will be used.

File names are case-sensitive on case-sensitive filesystems.