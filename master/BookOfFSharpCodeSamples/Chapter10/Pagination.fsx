#load "__querySource.fsx";;

let getFilmPageBySize pageSize pageNumber =
  query { for f in QuerySource.films do
          skip (pageSize * (pageNumber - 1))
          take pageSize
          select (f.ToString()) };;

getFilmPageBySize 3 1;;
getFilmPageBySize 3 2;;
getFilmPageBySize 3 3;;

let getFilmPageByYear year =
  query { for f in QuerySource.films do
          sortBy f.releaseYear
          skipWhile (f.releaseYear < year)
          takeWhile (f.releaseYear = year)
          select (f.ToString()) };;

getFilmPageByYear 1984;;
getFilmPageByYear 1985;;
getFilmPageByYear 1986;;
getFilmPageByYear 1987;;
