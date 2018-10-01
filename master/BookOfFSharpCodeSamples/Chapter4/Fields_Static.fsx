module Logger =
  let private log l c m = printfn "%-5s [%s] %s" l c m
  let LogInfo = log "INFO"
  let LogError = log "ERROR"

type MyService() =
  static let logCategory = "MyService"
  member x.DoSomething() =
    Logger.LogInfo logCategory "Doing something"
  member x.DoSomethingElse() =
    Logger.LogError logCategory "Doing something else"

let svc = MyService()
svc.DoSomething()
svc.DoSomethingElse()
