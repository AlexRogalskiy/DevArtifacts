type WorkItem(summary : string, desc : string) =
  member val Summary = summary
  member val Description = desc

type Defect(summary, desc, severity : int) =
  inherit WorkItem(summary, desc)
  member val Severity = severity

type Enhancement(summary, desc, requestedBy : string) =
  inherit WorkItem(summary, desc)
  member val RequestedBy = requestedBy
