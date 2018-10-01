#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

// displayPartialPage is defined in __asyncWorkflowShared.fsx

Async.Start(displayPartialPage (Uri "http://nostarch.com"));;

Async.CancelDefaultToken();;
