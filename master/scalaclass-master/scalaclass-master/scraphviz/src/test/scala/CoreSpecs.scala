/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.eamonn.test_scraphviz

import scraphviz.core.{ Graph, DiGraph }
import org.specs._
import java.io.File

object CoreSpecs extends Specification {

  "can handle undirected graph" in {
    val out = new File("2(a).png")
    if(out.exists){
      out.delete()
    }

    new Graph{
      label="2(a)"

      "master" shape 'box
      "HEAD" shape 'box
      
      "A" -- "B"
			"B" -- "C"
			"C" -- "master" 
			"master" -- "HEAD"
    }.png()

    out must exist
  }

  "can handle dot manual Figure 1" in {

    val out = new File("Small_graph.png")
    if(out.exists){
      out.delete()
    }
    
    new DiGraph{
      label = "Small graph"
			"parse" -> "execute";
      "main" -> "parse"
			  |
        +- -> "init";
        +- -> "cleanup";
        +- -> "printf";
      "execute" -> "make_string";
			  |
        +- -> "printf"
        +- -> "compare";
      "init" -> "make_string";
    }.png()
    
    out must exist
  }
  
  "can put labels on edges" in {

    val out = new File("edge_labels.png")
    if(out.exists){
      out.delete()
    }
    
    new DiGraph{
      label = "edge labels"
			"parse" -> "execute";
      ("main" -> "parse") label "from main"
			  |
        +- -> "init"  
        +- -> "cleanup"
        +- -> "printf" 
      ("execute" -> "make_string") label "from execute"
			  |
        +- -> "printf"
        +- -> "compare";
      "init" -> "make_string";
    }.png()
    
    out must exist
  }
  
  
}
