let r = System.Random()
let ints = Array.init 5 (fun _ -> r.Next(-100, 100));;

ints |> Array.sortInPlace;;

ints;;
