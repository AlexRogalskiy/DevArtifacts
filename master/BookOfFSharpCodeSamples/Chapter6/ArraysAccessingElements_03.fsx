let movies = [| "The Terminator"; "Predator"; "Commando" |];;

Array.set movies 1 "Batman & Robin"
Array.get movies 1 |> printfn "%s";;
