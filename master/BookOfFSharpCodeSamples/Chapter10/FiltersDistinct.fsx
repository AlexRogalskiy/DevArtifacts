#load "__querySource.fsx";;

query { for f in QuerySource.films do
        select f.releaseYear
        distinct }