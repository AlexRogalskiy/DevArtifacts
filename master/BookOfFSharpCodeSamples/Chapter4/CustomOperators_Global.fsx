open System
open System.Drawing

let (+) (l : Color) (r : Color) =
  Color.FromArgb(
    255, // Alpha channel
    Math.Min(255, int <| l.R + r.R),
    Math.Min(255, int <| l.G + r.G),
    Math.Min(255, int <| l.B + r.B))
