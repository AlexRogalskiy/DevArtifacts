module Chapter6

open System.IO

let private moviesFileName = System.IO.Path.Combine(__SOURCE_DIRECTORY__, "ArnoldMovies.txt")
let getMovieStream() = new StreamReader(moviesFileName);
let movies =
  seq { use r = getMovieStream()
        while not r.EndOfStream do
          let l = r.ReadLine().Split(',')
          yield l.[0], int l.[1] };;
let linesArray = 
  [| use r = getMovieStream()
     while not r.EndOfStream do yield r.ReadLine() |];;
