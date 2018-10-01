#load "__querySource.fsx";;

query { for f in QuerySource.films do select f };;

query { for f in QuerySource.films do
        select (f.name, f.releaseYear) };;
