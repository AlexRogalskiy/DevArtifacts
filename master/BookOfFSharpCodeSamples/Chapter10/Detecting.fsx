#load "__querySource.fsx";;

open System
open Microsoft.FSharp.Linq.NullableOperators
open QuerySource;;

let kindergartenCop =
  { id = 6; name = "Kindergarten Cop"; releaseYear = 1990; gross = Nullable 91457688.0 };;

query { for f in films do
        contains kindergartenCop };;

query { for f in films do
        select f.name
        contains "Kindergarten Cop" };;

query { for f in films do
        exists (f.name = "Kindergarten Cop") };;

query { for f in films do
        exists (f.gross ?>= 50000000.0) };;

