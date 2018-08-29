import reflect.runtime.currentMirror

object Name {
  def className(o: Any) = {
    currentMirror.reflect(o).symbol.toString.replace('$', ' ').split(' ').last
  }
}

trait Name {
  override def toString: String = Name.className(this)
}

class Chef extends Name

println(new Chef)