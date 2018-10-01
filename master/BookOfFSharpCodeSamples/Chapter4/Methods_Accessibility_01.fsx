type Circle(diameter : float) =
  member private x.GetRadius() = diameter / 2.0
  member x.Diameter = diameter
  member x.GetArea() = System.Math.PI * (x.GetRadius() ** 2.0)
