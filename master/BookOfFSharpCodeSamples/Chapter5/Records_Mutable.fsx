type rgbColor = { mutable R : byte
                  mutable G : byte
                  mutable B : byte }

let myColor = { R = 255uy; G = 255uy; B = 255uy }
myColor.G <- 100uy
