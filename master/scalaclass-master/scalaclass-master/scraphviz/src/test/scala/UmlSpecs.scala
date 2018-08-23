/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.eamonn.test_scraphviz

import scraphviz.core.DiGraph
import scraphviz.uml.Uml
import org.specs._
import java.io.File

object Specs  extends Specification {


  "can create a UML document" in {
    
    val out = new File("scraphviz.png")
    new Uml{
      label = "scraphviz"

      "UmlNode"|"\\|/&lt;&gt;-/-&lt;&gt;/&lt;\\|-/-\\|&gt;/--&gt;/&lt;--" |

      "AbstractEdge"|"style"|

      "AbstractGraph" | "add/dot/png" |

      "AbstractNode"|"shape/label/toString/declaration"|

      "DiEdge"|"toString/arrowhead/arrowtail/arrowsize"|

      "DiNode"|"-&gt;"|

      "Edge"|"toString"|

      "HasAtts"|"atts"|

      "Node"|"--"|
      
      "Uml" -|> "DiGraph" -|> "AbstractGraph" <|- "Graph" 
      "AbstractNode" -<> "AbstractGraph" <>- "AbstractEdge"
      "Edge" -|> "AbstractEdge" -|> "HasAtts" <|- "AbstractNode" <|- "Node"
      "DiEdge" -|> "AbstractEdge"
      "UmlNode" -|> "DiNode" -|> "AbstractNode"
    }.png()
    
    out must exist
  }

}
