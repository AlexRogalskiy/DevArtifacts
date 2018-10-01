type ClassWithStaticCtor() =
  static let mutable staticField = 0
  static do printfn "Invoking static initializer"
            staticField <- 10
  do printfn "Static Field Value: %i" staticField
