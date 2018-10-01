open System

[<AbstractClass>]
type Shape() =
  abstract member GetArea : unit -> float

type Circle(r : float) =
  inherit Shape()
  member val Radius = r
  override x.GetArea() = Math.Pow(Math.PI * r, 2.0)

type Rectangle(w : float, h : float) =
  inherit Shape()
  member val Width = w
  member val Height = h
  override x.GetArea() = w * h
