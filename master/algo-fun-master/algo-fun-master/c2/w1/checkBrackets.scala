import scala.reflect.ClassTag
object Brackets {
  val sep = " "

  class Stack[A:ClassTag] {
    private var interal:Array[A] = Array[A]()

    def push(elem:A) = interal:+=elem

    def pop() = {
      val tail = interal.last
      interal = interal.init
      tail
    }

    def empty() = interal.isEmpty

    override def toString():String = interal.deep.mkString(" ")
  }

  def main(args: Array[String]) {
    val value = scala.io.StdIn.readLine()
    print(isBalanced(value))
  } 

  def isBalanced(str:String) = {
      val stack = new Stack[Char]
      for (char <- str) {
      if (char == '(' || char == '[') {
        stack.push(char)
      } else {
        if (stack.empty()) false
        val top = stack.pop()
        if ((top=='[' && char!=']') || (top=='(' && char!=')')) false
      }
      stack.empty()
    }
  }
}