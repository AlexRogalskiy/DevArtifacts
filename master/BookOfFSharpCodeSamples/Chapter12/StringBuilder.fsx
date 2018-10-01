open System.Text

type StringFragment =
| Empty
| Fragment of string
| Concat of StringFragment * StringFragment
  override x.ToString() =
    let rec flatten frag (sb : StringBuilder) =
      match frag with
      | Empty -> sb
      | Fragment(s) -> sb.Append(s)
      | Concat(s1, s2) -> sb |> flatten s1 |> flatten s2
    (StringBuilder() |> flatten x).ToString();;

type StringFragmentBuilder() =
  member x.Zero() = Empty
  member x.Yield(v) = Fragment(v)
  member x.YieldFrom(v) = v
  member x.Combine(l, r) = Concat(l, r)
  member x.Delay(f) = f()
  member x.For(s, f) =
    Seq.map f s
    |> Seq.reduce (fun l r -> x.Combine(l, r));;

let buildString = StringFragmentBuilder();;

let bingo() =
  let buildNamePhrase fullName =
    buildString {
      yield "And "
      yield fullName
      yield " was his name-o\n"
    }
  let buildClapAndSpellPhrases chars =
    let spellPart =
      List.init (5 - (List.length chars)) (fun _ -> "*clap*") @ chars
      |> Seq.ofList
      |> String.concat "-"
    buildString {
      for i in 1..3 do yield spellPart
                       yield "\n" }
  let rec buildVerse fullName (chars : string list) =
    buildString {
      yield "There was a farmer who had a dog,\n"
      yield! buildNamePhrase fullName
      yield! buildClapAndSpellPhrases chars
      yield! buildNamePhrase fullName
      match chars with
      | [] -> ()
      | _::nextChars -> yield "\n"
                        yield! buildVerse fullName nextChars
    }
  let name = "Bingo"
  let letters = [ for c in name.ToUpper() -> c.ToString() ]
  buildVerse name letters;;

bingo() |> printfn "%O"

// Bonus: There's a hole in the bucket
(*
let henrySays complaint summary =
  buildString {
    yield (sprintf "%s,\n" complaint)
    yield "Dear Liza, dear Liza\n"
    yield (sprintf "%s,\n" complaint)
    yield (sprintf "Dear Liza, %s.\n\n" summary) }

let henryAsks question summary =
  buildString {
    yield (sprintf "%s,\n" question)
    yield "Dear Liza, dear Liza?\n"
    yield (sprintf "%s,\n" question)
    yield (sprintf "Dear Liza, %s?\n\n" summary) }

let lizaSays advice summary =
  buildString {
    yield (sprintf "%s, dear Henry,\n" advice)
    yield "Dear Henry, dear Henry\n"
    yield (sprintf "%s, dear Henry,\n" advice)
    yield (sprintf "Dear Henry, %s.\n\n" summary) }

buildString {
  yield! (henrySays "There's a hole in the bucket" "a hole")
  yield! (lizaSays "Then fix it" "fix it")
  yield! (henryAsks "With what shall I fix it" "with what")
  yield! (lizaSays "With a straw" "with a straw")
  yield! (henrySays "But the straw is too long" "too long")
  yield! (lizaSays "Then cut it" "cut it")
  yield "..."
} |> printfn "%O"
*)