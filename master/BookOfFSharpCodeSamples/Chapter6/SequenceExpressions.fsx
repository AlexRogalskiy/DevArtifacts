#load "__shared.fsx";;

open Chapter6;;

let lines = seq { use r = getMovieStream()
                  while not r.EndOfStream do yield r.ReadLine() }

lines |> printfn "%A";;
