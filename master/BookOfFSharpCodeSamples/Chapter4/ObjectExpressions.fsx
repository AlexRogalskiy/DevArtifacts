type IWeapon =
  abstract Description : string with get
  abstract Power : int with get

type Character(name : string, maxHP : int) =
  member x.Name = name
  member val HP = maxHP with get, set
  member val Weapon : IWeapon option = None with get, set
  member x.Attack(o : Character) =
    let power = match x.Weapon with
                | Some(w) -> w.Power
                | None -> 1 // fists
    o.HP <- System.Math.Max(0, o.HP - power)
  override x.ToString() = sprintf "%s: %i/%i" name x.HP maxHP

let witchKing = Character("Witch-king", 100)
let frodo = Character("Frodo", 50)

let forgeWeapon desc power =
  { new IWeapon with
      member x.Description with get() = desc
      member x.Power with get() = power
    interface System.IDisposable with
      member x.Dispose() = printfn "Disposing" }

let morgulBlade = forgeWeapon "Morgul-blade" 25
let sting = forgeWeapon "Sting" 10

witchKing.Weapon <- Some(morgulBlade)
frodo.Weapon <- Some(sting)
witchKing.Attack frodo

let narsil = forgeWeapon "Narsil" 25
(narsil :?> System.IDisposable).Dispose()