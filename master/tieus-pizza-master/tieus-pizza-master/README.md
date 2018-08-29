# tieus-pizza

Tieu's queuing algorithm of cooking and serving pizza is based on
**S**hortest **J**ob **N**ext algorithm which guarantees the minimal average
wait time for every job (pizzeria customer).

### Prerequisites ###

 * JDK 8
 * [SBT](http://www.scala-sbt.org/)

### How to run ###

    git clone https://github.com/eukgoekoko/tieus-pizza.git

    cd tieus-pizza

    sbt "run /path/to/input/file"

## Input file format

    n
    t_0 l_0
    t_1 l_1
    ...
    t_n l_n

## Output
A single integer number representing the min average waiting time for Tieu's clients.




