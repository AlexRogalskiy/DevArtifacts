#load "__shared.fsx";;

open Chapter6;;

movies |> Seq.sortBy snd;;
movies |> Seq.sortBy fst;;
