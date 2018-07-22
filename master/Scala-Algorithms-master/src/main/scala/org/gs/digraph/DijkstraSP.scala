package org.gs.digraph

import org.gs.queue.IndexMinPQ
import scala.annotation.tailrec

/** Solves for shortest path from a source where edge weights are non-negative
  *
  * @constructor creates a new DijkstraSP with an edge weighted digraph and source vertex
  * @param g acyclic digraph, edges have direction and weight
  * @param s source vertex
  * @see [[https://algs4.cs.princeton.edu/44sp/DijkstraSP.java.html]]
  * @author Scala translation by Gary Struthers from Java by Robert Sedgewick and Kevin Wayne.
  */
class DijkstraSP(g: EdgeWeightedDigraph, s: Int) {
  require(g.edges forall (_.weight >= 0))
  private[digraph] val _distTo = Array.fill[Double](g.numV)(Double.PositiveInfinity)
  _distTo(s) = 0.0
  private[digraph] val edgeTo = new Array[DirectedEdge](g.numV)
  private val pq = new IndexMinPQ[Double](g.numV)
  relaxVertices()

  private def relaxVertices() {

    def relax(e: DirectedEdge) {
      val v = e.from
      val w = e.to
      if (_distTo(w) > _distTo(v) + e.weight) {
        _distTo(w) = _distTo(v) + e.weight
        edgeTo(w) = e
        if (pq.contains(w)) pq.decreaseKey(w, _distTo(w)) else pq.insert(w, _distTo(w))
      }
    }

    @tailrec
    def loop() {
      if (!pq.isEmpty) {
        val v = pq.delMin
        g.adj(v) foreach (e => relax(e))
        loop()
      }
    }

    pq.insert(s, _distTo(s))
    loop()
  }

  /** returns length of shortest path from source to v */
  def distTo(v: Int): Double = _distTo(v)

  /** returns if there is a path from source to v */
  def hasPathTo(v: Int): Boolean = _distTo(v) < Double.PositiveInfinity

  /** returns path from source to v if it exists */
  def pathTo(v: Int): Option[List[DirectedEdge]] = {
    if (!hasPathTo(v)) None else {

      @tailrec
      def loop(e: DirectedEdge, path: List[DirectedEdge] ): List[DirectedEdge] = {
        if(e != null) loop(edgeTo(e.from), e :: path) else path
      }
      val path = loop(edgeTo(v), List[DirectedEdge]())
      Some(path)
    }
  }
}
