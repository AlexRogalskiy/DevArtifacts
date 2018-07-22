package org.gs.digraph

/** Find reachable vertices from single or multiple source vertices
  *
  * @constructor creates a new DirectedDFS with a digraph and any number of source vertices
  * @param g Digraph
  * @param sources a variable number of vertices
  * @see [[https://algs4.cs.princeton.edu/42directed/DirectedDFS.java.html]]
  * @author Scala translation by Gary Struthers from Java by Robert Sedgewick and Kevin Wayne.
  */
class DirectedDFS(g: Digraph, sources: Int*) {
  val marked = new Array[Boolean](g.numV)
  private var _count = 0

  /** returns number of vertices reachable from s */
  def count(): Int = _count

  private def dfs(v: Int): Unit = {
    _count += 1
    marked(v) = true
    g.adj(v) foreach (w => if (!marked(w)) dfs(w))
  }

  sources foreach (v => if(!marked(v)) dfs(v))

  /** returns if there is a path from any source to v */
  def isMarked(v: Int): Boolean = marked(v)
}
