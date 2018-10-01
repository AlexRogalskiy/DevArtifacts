let getLength =
  function
  | [ ] -> 0
  | [ _ ] -> 1
  | [ _; _; ] -> 2
  | [ _; _; _ ] -> 3
  | lst -> lst |> List.length
