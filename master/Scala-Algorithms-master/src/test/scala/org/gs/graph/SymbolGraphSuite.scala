package org.gs.graph

import org.gs.fixtures.IntArrayBuilder
import org.gs.graph.fixtures.SymbolGraphBuilder
import org.scalatest.FlatSpec

/** [[org.gs.graph.SymbolGraph]]
  * 
  * @see [[https://algs4.cs.princeton.edu/41undirected/movies.txt]]
  * @see [[https://algs4.cs.princeton.edu/41undirected/routes.txt]]
  * @author Gary Struthers
  */

class SymbolGraphSuite extends FlatSpec {
  class Movies extends SymbolGraphBuilder {
    val d = buildSymbolGraph("https://algs4.cs.princeton.edu/41undirected/movies.txt", "/")
  }
  val movies = new Movies

  behavior of "a SymbolGraph"

  it should "find vertices as keys and routes" in new SymbolGraphBuilder {
    val d = buildSymbolGraph("https://algs4.cs.princeton.edu/41undirected/routes.txt", "\\s+")
    val keys = d.keys
    val g = d.g
    assert("JFK" === keys(0))
    val wJFK = for (w <- g.adj(0)) yield keys(w)
    assert(wJFK.diff(List("MCO", "ATL", "ORD")) === List())
    assert("LAX" === keys(8))
    val wLAX = for (w <- g.adj(8)) yield keys(w)
    assert(wLAX.diff(List("LAS", "PHX")) === List())
  }

  it should "find movies and their actors as keys and adjacencies" in {
    val d = movies.d
    val keys = d.keys
    val g = d.g
    val movieIdx = d.index("Tin Men (1987)")
    val wTinMen = movieIdx match {
      case Some(x) => for (w <- g.adj(x)) yield keys(w)
      case None => fail(s"Tin Men (1987) not found")
    }
    assert(wTinMen.contains("Munchel, Lois Raymond"))
  }

  it should "find actors and their movies as keys and adjacencies" in {
    val d = movies.d
    val keys = d.keys
    val g = d.g
    val idx = d.index("Bacon, Kevin")
    val ws = idx match {
      case Some(x) => for (w <- g.adj(x)) yield keys(w)
      case None => fail(s"Bacon, Kevin not found")
    }
    val count = ws.size
    assert(ws.contains("Wild Things (1998)"))
  }
}
