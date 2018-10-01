type Circle(diameter : float) =
  let getRadius() = diameter / 2.0
  member x.Diameter = diameter
  member x.GetArea() = System.Math.PI * (getRadius() ** 2.0)
