type rgbColor = { R : byte; G : byte; B : byte }
                member x.ToHexString() = sprintf "#%02X%02X%02X" x.R x.G x.B
                static member Red = { R = 255uy; G = 0uy; B = 0uy }
                static member Green = { R = 0uy; G = 255uy; B = 0uy }
                static member Blue = { R = 0uy; G = 0uy; B = 255uy }

rgbColor.Red.ToHexString()
