[<AbstractClass>]
type AbstractBaseClass() =
  abstract member SomeData : string with get, set

type BindingBackedClass() =
  inherit AbstractBaseClass()
  let mutable someData = ""
  override x.SomeData
    with get() = someData
    and set(v) = someData <- v

type DictionaryBackedClass() =
  inherit AbstractBaseClass()
  let dict = System.Collections.Generic.Dictionary<string, string>()
  [<Literal>]
  let SomeDataKey = "SomeData"
  override x.SomeData
    with get() =
      match dict.TryGetValue(SomeDataKey) with
      | true, v -> v
      | _, _ -> ""
    and set(v) =
      match System.String.IsNullOrEmpty(v) with
      | true when dict.ContainsKey(SomeDataKey) ->
        dict.Remove(SomeDataKey) |> ignore
      | _ -> dict.[SomeDataKey] <- v
