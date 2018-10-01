type MyException(message, category) =
  inherit exn(message)
  member x.Category = category
  override x.ToString() = sprintf "[%s] %s" category message
