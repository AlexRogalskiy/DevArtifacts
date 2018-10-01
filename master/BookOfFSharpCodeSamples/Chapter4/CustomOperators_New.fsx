open System

type RgbColor(r, g, b) =
  member x.Red = r
  member x.Green = g
  member x.Blue = b
  override x.ToString() = sprintf "(%i, %i, %i)" r g b
  /// Blend two colors
  static member (+=) (l : RgbColor, r : RgbColor) =
    RgbColor(
      (l.Red + r.Red) / 2,
      (l.Green + r.Green) / 2,
      (l.Blue + r.Blue) / 2)

let yellow = RgbColor(255, 255, 0)
let blue = RgbColor(0, 0, 255)
let grey = yellow += blue
