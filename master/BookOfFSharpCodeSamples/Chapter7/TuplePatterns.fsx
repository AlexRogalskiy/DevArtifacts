let point = 10, 20
let x, y = point;;

let locatePoint p =
  match p with
  | (0, 0) -> sprintf "%A is at the origin" p
  | (_, 0) -> sprintf "%A is on the x-axis" p
  | (0, _) -> sprintf "%A is on the y-axis" p
  | (x, y) -> sprintf "Point (%i, %i)" x y
