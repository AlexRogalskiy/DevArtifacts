let rec factorial v =
  match v with
  | 1L -> 1L
  | _ -> v * factorial (v - 1L)

let fiveFactorial = factorial 5L
