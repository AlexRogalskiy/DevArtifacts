#load "__shared.fsx";;

open Chapter6;;

movies |> Seq.filter (fun (_, year) -> year < 1985);;
