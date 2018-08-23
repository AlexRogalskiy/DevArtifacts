/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.eamonn.scraphviz.core

trait Graph extends AbstractGraph{
	override var tag = "graph"

	implicit def toNode(s:String) = new Node(this,s)

	var node = new AbstractNode(this,"node"){
		override def toString = "node"
		override def declaration = if(isEmpty) "" else super.declaration
	}

	var edge = new AbstractNode(this,"edge"){
		override def toString = "edge"
		override def declaration = if(isEmpty) "" else super.declaration
	}

}
