let set1 = [ 1..5 ] |> Set.ofList
let set2 = [ 3..7 ] |> Set.ofList
Set.difference set1 set2;;

set1 - set2;;