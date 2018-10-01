type Shape =
| Circle of float
| Rectangle of float * float
| Triangle of float * float * float

let getPerimeter =
  function
  | Circle(r) -> 2.0 * System.Math.PI * r
  | Rectangle(w, h) -> 2.0 * (w + h)
  | Triangle(l1, l2, l3) -> l1 + l2 + l3
