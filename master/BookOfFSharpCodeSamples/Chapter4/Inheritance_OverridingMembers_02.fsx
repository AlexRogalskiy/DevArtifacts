type WorkItem(summary : string, desc : string) =
  inherit System.Object()
  member val Summary = summary
  member val Description = desc
  override x.ToString() = sprintf "[%s] %s" (base.ToString()) x.Summary

type Defect(summary, desc, severity : int) =
  inherit WorkItem(summary, desc)
  member val Severity = severity
  override x.ToString() = sprintf "%s (%i)" (base.ToString()) x.Severity
