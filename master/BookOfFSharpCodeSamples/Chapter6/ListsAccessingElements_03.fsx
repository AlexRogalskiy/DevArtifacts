let rec contains fn l =
  if l = [] then false
  else fn(List.head l) || contains fn (List.tail l);;

[] |> contains (fun n -> n = "Rose");;

let names = [ "Rose"; "Martha"; "Donna"; "Amy"; "Clara" ];;
names |> contains (fun n -> n = "Amy");;
names |> contains (fun n -> n = "Rory");;
