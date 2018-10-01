type rgbColor = { R : byte; G : byte; B : byte }
                member x.ToHexString() = sprintf "#%02X%02X%02X" x.R x.G x.B

let red = { R = 255uy; G = 0uy; B = 0uy }
red.ToHexString()
