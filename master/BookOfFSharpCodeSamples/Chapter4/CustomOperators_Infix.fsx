open System

type RgbColor(r, g, b) =
  member x.Red = r
  member x.Green = g
  member x.Blue = b
  override x.ToString() = sprintf "(%i, %i, %i)" r g b
  /// Add two colors
  static member (+) (l : RgbColor, r : RgbColor) =
    RgbColor(
      Math.Min(255, l.Red + r.Red),
      Math.Min(255, l.Green + r.Green),
      Math.Min(255, l.Blue + r.Blue))
  /// Subtract two colors
  static member (-) (l : RgbColor, r : RgbColor) =
    RgbColor(
      Math.Max(0, l.Red - r.Red),
      Math.Max(0, l.Green - r.Green),
      Math.Max(0, l.Blue - r.Blue))

let red = RgbColor(255, 0, 0)
let green = RgbColor(0, 255, 0)
let yellow = red + green

let magenta = RgbColor(255, 0, 255)
let blue = magenta - red
