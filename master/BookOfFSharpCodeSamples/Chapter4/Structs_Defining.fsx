[<Struct>]
type Circle(diameter : float) =
  member x.getRadius() = diameter / 2.0
  member x.Diameter = diameter
  member x.GetArea() = System.Math.PI * (x.getRadius() ** 2.0)
