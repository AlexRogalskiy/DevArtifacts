type Shape =
| Circle of Radius : float
| Rectangle of Width : float * Height : float
| Triangle of Leg1 : float * Leg2 : float * Leg3 : float

let c = Circle(Radius = 3.0)
let r = Rectangle(Width = 10.0, Height = 12.0)
let t = Triangle(Leg1 = 25.0, Leg2 = 20.0, Leg3 = 7.0)
