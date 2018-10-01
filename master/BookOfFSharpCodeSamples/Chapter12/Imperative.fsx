open System
open System.Collections.Generic

type Imperative<'T> = unit -> 'T option

type ImperativeBuilder() =
  member x.Return(v) : Imperative<_> =
    fun () -> Some(v)

  member x.Zero() =
    fun () -> None

  member x.Delay(f : unit -> Imperative<_>) =
    fun () -> f()()

  member x.Combine(a, b) =
    fun () -> match a() with
              | Some(v) -> Some(v)
              | None -> b()

  member x.Run(imp) =
    match imp() with
    | Some(v) -> v
    | None -> failwith "Nothing returned"

  member x.For (inp : _ seq, f) =
    let rec loop (en : IEnumerator<_>) =
      if not (en.MoveNext()) then x.Zero()
      else x.Combine(f(en.Current), x.Delay(fun () -> loop en))
    inp.GetEnumerator() |> loop

  member x.While (gd, body) =
    let rec loop() =
      if not (gd()) then x.Zero()
      else x.Combine(body, x.Delay(fun () -> loop()))
    loop()

let imperative = ImperativeBuilder()

let validateName (arg : string) = imperative {
  if arg = null then return false

  let idx = arg.IndexOf(" ")
  if idx = -1 then return false

  let name = arg.Substring(0, idx)
  let surname = arg.Substring(idx + 1, arg.Length - idx - 1)
  if surname.Length < 1 || name.Length < 1 then return false
  if (Char.IsLower(surname.[0]) || Char.IsLower(name.[0])) then return false

  return true }

validateName(null)
validateName("Tomas")
validateName("Tomas Petricek")

let readFirstName() = imperative {
  while true do
    let name = Console.ReadLine()
    if validateName name then return name
    printfn "invalid name" }

readFirstName()

let exists f inp = imperative {
  for v in inp do
    if f(v) then return true
  return false }

[ 1..10 ] |> exists (fun v -> v % 3 = 0)