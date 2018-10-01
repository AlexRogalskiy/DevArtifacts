let testOption =
  function
  | Some(v) -> printfn "Some: %i" v
  | None -> printfn "None";;

// Equates to:
//fun x ->
//  match x with
//  | Some(v) -> printfn "Some: %i" v
//  | None -> printfn "None";;