package org.gs.digraph

import org.gs.graph.BaseGraph

/** [[org.gs.digraph.EdgeWeightedDigraph]], [[org.gs.digraph.Topological]] use this to tell a
 *  [[org.gs.graph.Graph]] from a [[org.gs.digraph.Digraph]]
 */
trait DigraphMarker

/** Directed Graph
  *
  * @constructor creates a new Digraph with a number of vertices
  * @param v number of vertices
  * @see [[https://algs4.cs.princeton.edu/42directed/Digraph.java.html]]
  * @author Scala translation by Gary Struthers from Java by Robert Sedgewick and Kevin Wayne.
  */
class Digraph(v: Int) extends BaseGraph(v) with DigraphMarker {

  /** returns a reverse order copy */
  def reverse(): Digraph = {
    val r = new Digraph(v)
    for {
      newV <- 0 until v
      w <- adj(newV)
    } r.addEdge(w, newV)
    r
  }
}
