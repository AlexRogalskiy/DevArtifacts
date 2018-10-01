let echoUserInput (getInput : unit -> string) =
  let mutable input = getInput()
  while not (input.ToUpper().Equals("QUIT")) do
    printfn "You entered: %s" input
    input <- getInput()

echoUserInput (fun () -> printfn "Type something and press enter"
                         System.Console.ReadLine())
