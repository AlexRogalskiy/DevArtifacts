/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.eamonn.scraphviz.uml

import core.DiGraph
import Uml._

trait Uml extends DiGraph {
	implicit def toUmlNode(s:String) = new UmlNode(this,s)

	def abst(s:String) = {val n=new UmlNode(this,s); n color ISA; n}
}

object Uml{
	def ISA  = "/dark23/1"
	def HASA = "/dark23/2"
	def USES = "/dark23/3"
}


