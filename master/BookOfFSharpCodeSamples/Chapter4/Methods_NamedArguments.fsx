open System
open System.Drawing

type ColorDistance() =
  member x.GetEuclideanDistance(c1 : Color, c2 : Color) =
    let getPointDistance p1 p2 = (float p1 - float p2) ** 2.0
    [ getPointDistance c1.R c2.R
      getPointDistance c1.G c2.G
      getPointDistance c1.B c2.B ] |> List.sum |> Math.Sqrt

let d = ColorDistance()
d.GetEuclideanDistance(c2 = Color.White, c1 = Color.Snow)
