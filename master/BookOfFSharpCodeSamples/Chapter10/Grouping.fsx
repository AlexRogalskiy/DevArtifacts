#load "__querySource.fsx";;

query { for f in QuerySource.films do
        groupBy f.releaseYear into g
        sortBy g.Key
        select (g.Key, g) };;

query { for f in QuerySource.films do
        groupValBy (f.name, f.gross) f.releaseYear into g
        sortBy g.Key
        select (g.Key, g) };;
