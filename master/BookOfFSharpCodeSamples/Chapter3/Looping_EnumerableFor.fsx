type MpaaRating =
| G
| PG
| PG13
| R
| NC17

type Movie = { Title : string; Year : int; Rating : MpaaRating option }

let movies = [ { Title = "The Last Witch Hunter"; Year = 2014; Rating = None }
               { Title = "Riddick"; Year = 2013; Rating = Some(R) }
               { Title = "Fast Five"; Year = 2011; Rating = Some(PG13) }
               { Title = "Babylon A.D."; Year = 2008; Rating = Some(PG13) } ]

for { Title = t; Year = y; Rating = Some(r) } in movies do printfn "%s (%i) - %A" t y r
