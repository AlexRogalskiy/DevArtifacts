module TheBookOfFSharp.Chapter12.TimedOperationMonad

type TimedOperation<'T> = { Result : 'T; ElapsedTime : System.TimeSpan }

type TimedOperationBuilder() =
  member x.Zero() = ()
  member x.Run(f) : TimedOperation<_> = f()
  member x.Delay(f) =
    fun () -> let sw = System.Diagnostics.Stopwatch()
              sw.Start()
              let r = f()
              sw.Stop()
              { Result = r; ElapsedTime = sw.Elapsed }
  member x.Bind(v, rest) = rest v
  member x.Return(v) = v

let timed = TimedOperationBuilder()

do
  let result =
    timed {
      let delay = System.Random().Next(2000)
      delay |> System.Threading.Thread.Sleep
      return [| "Rose"; "Martha"; "Donna"; "Amy"; "Clara" |]
    }

  printfn "Completed operation in %f seconds" result.ElapsedTime.TotalSeconds

  let result2 =
    timed {
      do! System.Threading.Thread.Sleep(2000)
    }

  printfn "Completed operation in %f seconds" result2.ElapsedTime.TotalSeconds
