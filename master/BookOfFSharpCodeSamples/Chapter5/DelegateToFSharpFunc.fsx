open System.Runtime.CompilerServices

[<Extension>]
type public FSharpFuncUtil =
  [<Extension>]
  static member ToFSharpFunc<'a, 'b> (func : System.Func<'a, 'b>) =
    fun x -> func.Invoke(x)
  [<Extension>]
  static member ToFSharpFunc<'a> (act : System.Action<'a>) =
    fun x -> act.Invoke(x)
