#load "__querySource.fsx";;

query { for f in QuerySource.films do
        join fa in QuerySource.filmActors on (f.id = fa.filmId)
        join a in QuerySource.actors on (fa.actorId = a.id)
        select (f.name, f.releaseYear, a.lastName, a.firstName) } |> Seq.toList;;

query { for f in QuerySource.films do
        groupJoin fa in QuerySource.filmActors on (f.id = fa.filmId) into junction
        select (f.name, query { for j in junction do 
                                join a in QuerySource.actors on (j.actorId = a.id)
                                select (a.lastName, a.firstName) } ) };;

let actorsFilmActors =
  query { for a in QuerySource.actors do
          join fa in QuerySource.filmActors on (a.id = fa.actorId)
          select (fa.filmId, a) };;

// Raises NullReferenceException
query { for f in QuerySource.films do
        leftOuterJoin fa in QuerySource.filmActors on (f.id = fa.filmId) into junction
        for j in junction do
        join a in QuerySource.actors on (j.actorId = a.id)
        select (f.name, f.releaseYear, a.lastName, a.firstName) }
|> Seq.iter (printfn "%O");;

query { for f in QuerySource.films do
        leftOuterJoin (id, a) in actorsFilmActors on (f.id = id) into junction
        for x in junction do
        select (match (x :> obj) with
                | null -> (f.name, "", "")
                | _ -> let _, a = x
                       (f.name, a.lastName, a.firstName))
         } |> Seq.toList;;
