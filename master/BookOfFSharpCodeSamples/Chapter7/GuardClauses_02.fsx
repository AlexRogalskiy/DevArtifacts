let testNumber value =
  match value with
  | v when v > 0 && v % 2 = 0 -> printfn "%i is positive and even" v
  | v -> printfn "%i is zero, negative, or odd" v
