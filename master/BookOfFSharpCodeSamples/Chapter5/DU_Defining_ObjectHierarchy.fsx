type Shape =
/// Describes a circle by its radius
| Circle of float
/// Describes a rectangle by its width and height
| Rectangle of float * float
/// Describes a triangle by its three sides
| Triangle of float * float * float

let c = Circle(3.0)
let r = Rectangle(10.0, 12.0)
let t = Triangle(25.0, 20.0, 7.0)
