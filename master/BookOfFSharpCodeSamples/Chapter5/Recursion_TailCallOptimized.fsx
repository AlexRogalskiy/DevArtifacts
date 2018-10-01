let factorial v =
  let rec fact c p =
    match c with
    | 0L -> p
    | _ -> fact <| c - 1L <| c * p
  fact v 1L

factorial 5L
