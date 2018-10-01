type Processor() =
  static let mutable itemsProcessed = 0
  static member ItemsProcessed = itemsProcessed
  member x.Process() =
    itemsProcessed <- itemsProcessed + 1
    printfn "Processing..."

while Processor.ItemsProcessed < 5 do (Processor()).Process()
