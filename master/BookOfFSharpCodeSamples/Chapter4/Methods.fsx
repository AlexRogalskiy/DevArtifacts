open System

type Circle(diameter : float) =
  member x.Diameter = diameter
  member x.GetArea() =
    let r = diameter / 2.0
    Math.PI * (r ** 2.0)

let c = Circle 5.0
c.GetArea()
