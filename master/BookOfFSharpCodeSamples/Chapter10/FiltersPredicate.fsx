#load "__querySource.fsx";;

open Microsoft.FSharp.Linq.NullableOperators

query { for f in QuerySource.films do
        where (f.releaseYear = 1984)
        select (f.ToString()) };;

query { for f in QuerySource.films do
        where (f.gross ?<= 40000000.0)
        select (f.ToString()) };;

query { for f in QuerySource.films do
        where (f.releaseYear = 1987 && f.gross ?<= 40000000.0)
        select (f.ToString()) };;

query { for f in QuerySource.films do
        select f.releaseYear
        distinct };;