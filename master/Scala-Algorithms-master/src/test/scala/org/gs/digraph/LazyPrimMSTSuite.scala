package org.gs.digraph

import org.gs.digraph.fixtures.{DirectedEdgeBuilder, EdgeWeightedGraphBuilder, GraphBuilder, MSTBuilder,
  PrimMSTBuilder}
import org.gs.graph.{Edge, EdgeWeightedGraph}
import org.gs.graph.fixtures.EdgeBuilder
import org.gs.set.UF
import org.scalatest.FlatSpec
import org.scalatest.Matchers._
import scala.annotation.tailrec

/** @see [[https://algs4.cs.princeton.edu/43mst/tinyEWG.txt]]
  *
  * @author Gary Struthers
  */
class LazyPrimMSTSuite extends FlatSpec {

  trait LazyPrimMSTBuilder extends MSTBuilder {
    val primMST = new LazyPrimMST(g)
  }
  behavior of "a LazyPrimMST"

  it should "create a minimal spanning tree from an EdgeWeightedGraph" in new GraphBuilder {
    val primMST = new LazyPrimMST(g)
  }

  it should "calulate total edge weight of tinyEWG MST" in new EdgeWeightedGraphBuilder {
    val g = buildGraph("https://algs4.cs.princeton.edu/43mst/tinyEWG.txt")
    val mst = new LazyPrimMST(g)
    val weight = mst.weight
    assert(weight === 1.81)
  }
  
  it should "match expected edges in a MST" in new LazyPrimMSTBuilder {
    val edges = primMST.edges
    val diff = edges.diff(tinyMSTArray)
    assert(edges.diff(tinyMSTArray).size === 0)
  }

  it should "be acyclic" in new LazyPrimMSTBuilder {
    val hasCycle = buildUF(primMST.edges)
    assert(hasCycle === false)
  }

  it should "find a spanning forest" in new LazyPrimMSTBuilder {
    val edges = primMST.edges
    val hasCycle = buildUF(primMST.edges)

    @tailrec
    def loop(i: Int): Boolean = {
      if (i < edges.length) {
        val v = edges(i).either
        val w = edges(i).other(v)
        val foundV = uf.find(v)
        val foundW = uf.find(w)
        if (!uf.connected(v, w)) false else loop(i + 1)
      } else true
    }
    var spanningForest = loop(0)
    assert(spanningForest === true)
  }

  it should "validate a minimal spanning forest" in new LazyPrimMSTBuilder {
    assert(primMST.checkIsMinSpanningForest === true)
  }
  
  it should "calulate total edge weight of mediumEWG MST" in new EdgeWeightedGraphBuilder {
    val g = buildGraph("https://algs4.cs.princeton.edu/43mst/mediumEWG.txt")
    val mst = new LazyPrimMST(g)
    val weight = mst.weight
    assert(weight === 10.46351 +- 0.000005)
  }
  
  it should "calulate total edge weight of largeEWG MST" in new EdgeWeightedGraphBuilder {
    val g = buildGraph("https://algs4.cs.princeton.edu/43mst/largeEWG.txt")
    val mst = new LazyPrimMST(g)
    val weight = mst.weight
    assert(weight === 647.66307 +- 0.000005)
  }
}
