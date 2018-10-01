let locatePoint =
  function
  | (0, 0) as p -> sprintf "%A is at the origin" p
  | (x, y) & (_, 0) -> sprintf "(%i, %i) is on the x-axis" x y
  | (x, y) & (0, _) -> sprintf "(%i, %i) is on the y-axis" x y
  | (x, y) -> sprintf "Point (%i, %i)" x y
