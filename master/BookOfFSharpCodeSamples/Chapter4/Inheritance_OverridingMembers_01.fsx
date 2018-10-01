type WorkItem(summary : string, desc : string) =
  member val Summary = summary
  member val Description = desc
  override x.ToString() = sprintf "%s" x.Summary

type Defect(summary, desc, severity : int) =
  inherit WorkItem(summary, desc)
  member val Severity = severity
  override x.ToString() = sprintf "%s (%i)" x.Summary x.Severity
