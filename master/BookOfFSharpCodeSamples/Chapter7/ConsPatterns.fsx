let getLength n =
  let rec len c l =
    match l with
    | [] -> c
    | _ :: t -> len (c + 1) t
  len 0 n
