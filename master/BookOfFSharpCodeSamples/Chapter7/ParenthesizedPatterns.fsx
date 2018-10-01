let locatePoint =
  function
  | (0, 0) as p -> sprintf "%A is at the origin" p
  | (x, y) & ((_, 0) | (0, _)) -> sprintf "(%i, %i) is on an axis" x y
  | p -> sprintf "Point %A" p
