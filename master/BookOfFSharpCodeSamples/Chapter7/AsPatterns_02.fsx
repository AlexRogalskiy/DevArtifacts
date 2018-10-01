let locatePoint =
  function
  | (0, 0) as p -> sprintf "%A is at the origin" p
  | (_, 0) as p -> sprintf "%A is on the X-Axis" p
  | (0, _) as p -> sprintf "%A is on the Y-Axis" p
  | (x, y) as p -> sprintf "Point (%i, %i)" x y
