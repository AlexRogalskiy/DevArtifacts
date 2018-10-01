#load "__querySource.fsx";;

query { for f in QuerySource.films do
        sortBy f.name
        select (f.ToString()) };;

query { for f in QuerySource.films do
        sortByDescending f.name
        select (f.ToString()) };;

query { for f in QuerySource.films do
        sortBy f.releaseYear
        thenByNullableDescending f.gross
        thenBy f.name
        select (f.releaseYear, f.name, f.gross) };;

query { for f in QuerySource.films do
        sortByNullable f.gross
        select (sprintf "%A (%O)" f.name f.gross) };;
