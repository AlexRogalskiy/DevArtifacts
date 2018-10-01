#load "__querySource.fsx";;

query { for f in QuerySource.films do headOrDefault };;

query { for f in QuerySource.films do lastOrDefault };;

query { for f in QuerySource.films do nth 2 };;

query { for f in QuerySource.films do find (f.releaseYear = 1987) };;

query { for f in QuerySource.films do
        where (f.id = 4)
        exactlyOne };;
