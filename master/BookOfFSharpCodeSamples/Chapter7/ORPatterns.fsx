let locatePoint =
  function
  | (0, 0) as p -> sprintf "%A is at the origin" p
  | (_, 0) | (0, _) as p -> sprintf "%A is on an axis" p
  | p -> sprintf "Point %A" p
