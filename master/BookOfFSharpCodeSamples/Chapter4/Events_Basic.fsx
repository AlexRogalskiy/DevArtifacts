let ticks = ref 0
let t = new System.Timers.Timer(500.0)
t.Elapsed.Add (fun ea -> printfn "tick"; ticks := ticks.Value + 1)
t.Start()
while ticks.Value < 5 do ()
t.Dispose()
