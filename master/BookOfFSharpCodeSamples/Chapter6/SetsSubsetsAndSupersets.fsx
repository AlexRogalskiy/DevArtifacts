let set1 = [ 1..5 ] |> Set.ofList
let set2 = [ 1..5 ] |> Set.ofList;;

Set.isSuperset set1 set2;;
Set.isProperSuperset set1 set2;;
Set.isSubset set2 set1;;
Set.isProperSubset set2 set1;;

let set1 = [ 0..5 ] |> Set.ofList;;

Set.isSuperset set1 set2;;
Set.isProperSuperset set1 set2;;
Set.isSubset set2 set1;;
Set.isProperSubset set2 set1;;
