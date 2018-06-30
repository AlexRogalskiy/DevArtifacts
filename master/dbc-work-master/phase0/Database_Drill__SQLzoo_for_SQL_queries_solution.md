##Scores
![Database Drill Scores](http://goo.gl/cRMOU1)

##Reflection
I was stuck for quite a while on the final problem (#13) in the bonus JOIN section. 

First, I had trouble distributing the scores correctly across the teams for each record--but I realized I should be using `SUM` and not `COUNT`. 

Next, I could not figure out how to populate the records (rows/games) with a 0-0 tie. With an `INNER JOIN` (default `JOIN` behavior), only when the joined field appears in both tables will the result table be populated with data. However, *there are different types of joins* and we needed the one where all *games* are populated, regardless of whether they appear in the table describing *goals* (because games that result in a draw wouldn't show up in the goals table). Remembering this, I went for a `LEFT JOIN`--including all items from my "left" table (*game*) and those that match on the joined feild from the "right" table (*goal*).
```sql
SELECT m.mdate,
       m.team1,
       SUM(CASE WHEN g.teamid=m.team1 THEN 1 ELSE 0 END) as score1,
       m.team2,
       SUM(CASE WHEN g.teamid=m.team2 THEN 1 ELSE 0 END) as score2
FROM game m LEFT JOIN goal g ON g.matchid = m.id
GROUP BY m.id
ORDER BY m.mdate, g.matchid, m.team1, m.team2
```
. 
###[Types of Joins](http://www.w3schools.com/sql/sql_join.asp)
Wikipedia notes the ANSI-standard SQL specifies five types of `JOIN`: `INNER`, `LEFT OUTER`, `RIGHT OUTER`, `FULL OUTER` and `CROSS`. When I leared SQL a couple years ago, we broke it down to four.

**INNER JOIN**: Returns all rows when there is at least one match in BOTH tables<br />
**LEFT JOIN**: Return all rows from the left table, and the matched rows from the right table<br />
**RIGHT JOIN**: Return all rows from the right table, and the matched rows from the left table<br />
**FULL JOIN**: Return all rows when there is a match in ONE of the tables