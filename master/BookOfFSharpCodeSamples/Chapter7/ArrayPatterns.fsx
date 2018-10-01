let getLength =
  function
  | null -> 0
  | [| |] -> 0
  | [| _ |] -> 1
  | [| _; _; |] -> 2
  | [| _; _; _ |] -> 3
  | a -> a |> Array.length
