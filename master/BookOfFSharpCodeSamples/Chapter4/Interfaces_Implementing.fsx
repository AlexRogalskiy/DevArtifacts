open System

type MyDisposable() =
  interface IDisposable with
    member x.Dispose() = printfn "Disposing"

let d = new MyDisposable()
(d :> IDisposable).Dispose()
