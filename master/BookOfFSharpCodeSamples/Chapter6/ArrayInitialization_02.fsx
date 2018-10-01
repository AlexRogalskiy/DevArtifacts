#load "__shared.fsx"

open Chapter6

let lines = [| use r = getMovieStream()
               while not r.EndOfStream do yield r.ReadLine() |];;