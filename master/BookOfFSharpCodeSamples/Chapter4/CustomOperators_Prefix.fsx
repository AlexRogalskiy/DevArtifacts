type RgbColor(r, g, b) =
  member x.Red = r
  member x.Green = g
  member x.Blue = b
  override x.ToString() = sprintf "(%i, %i, %i)" r g b
  /// Negate a color
  static member (~-) (r : RgbColor) =
    RgbColor(
      r.Red ^^^ 0xFF,
      r.Green ^^^ 0xFF,
      r.Blue ^^^ 0xFF)

let yellow = RgbColor(255, 255, 0)
let blue = -yellow
