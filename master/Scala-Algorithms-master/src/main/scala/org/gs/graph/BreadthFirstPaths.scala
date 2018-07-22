package org.gs.graph

import scala.annotation.tailrec
import scala.collection.mutable.{ListBuffer, Queue}

/** Find shortest path from source vertex to v
  *
  * Enqueue a vertex that has been marked but its adjacencies haven't been. Then dequeue a vertex and
  * enqueue all its unmarked adjacencies and mark them
  *
  * @constructor creates a new BreadthFirstPaths with a graph and source vertex
  * @param g Graph
  * @param s source vertex
  * @see [[https://algs4.cs.princeton.edu/41undirected/BreadthFirstPaths.java.html]]
  * @author Scala translation by Gary Struthers from Java by Robert Sedgewick and Kevin Wayne.
  */
class BreadthFirstPaths(g: Graph, s: Int) {
  private[graph] val marked = Array.fill[Boolean](g.numV)(false)
  private[graph] val edgeTo = new Array[Int](g.numV)
  private[graph] val _distTo = Array.fill[Int](g.numV)(Int.MaxValue)

  private def bfs(s: Int): Unit = {
    _distTo(s) = 0
    marked(s) = true

    @tailrec
    def loop(q: Queue[Int]): Unit = if (!q.isEmpty) {
      val v = q.dequeue
      g.adj(v) foreach (w => if (!marked(w)) {
        edgeTo(w) = v
        _distTo(w) = _distTo(v) + 1
        marked(w) = true
        q.enqueue(w)
      })
      loop(q)
    }

    loop(Queue[Int](s))
  }

  bfs(s)

  /** is there a path from source vertex s to v */
  def hasPathTo(v: Int): Boolean = marked(v)

  /** returns number of edges in shortest path from source vertex to v */
  def distTo(v: Int): Int = _distTo(v)

  /** returns a list of vertices in the shortest path from the source vertex to v */
  def pathTo(v: Int): Option[List[Int]] = if (!hasPathTo(v)) None else {

    @tailrec
    def loop(x: Int, xs: List[Int]): List[Int] = if (distTo(x) != 0) loop(edgeTo(x), x :: xs) else x :: xs

    Some(loop(v, List[Int]()))
  }
}
