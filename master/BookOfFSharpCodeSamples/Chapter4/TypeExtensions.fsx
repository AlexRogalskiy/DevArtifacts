module ColorExtensions =
  open System
  open System.Drawing
  open System.Text.RegularExpressions
  
  // Regular expression to parse the ARGB components from a hex string
  let private hexPattern =
    Regex("^#(?<color>[\dA-F]{8})$", RegexOptions.IgnoreCase ||| RegexOptions.Compiled)

  // Type extension
  type Color with
    static member FromHex(hex) =
      match hexPattern.Match hex with
      | matches when matches.Success ->
        Color.FromArgb <| Convert.ToInt32(matches.Groups.["color"].Value, 16)
      | _ -> Color.Empty
    member x.ToHex() = sprintf "#%02X%02X%02X%02X" x.A x.R x.G x.B
