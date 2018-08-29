case class Art(title: String, artist: String, style: Option[String] = None)

val oldCall = Art("Chef", "Pupa")
val neCall = Art("Chef", "Pupa", Option("Art"))