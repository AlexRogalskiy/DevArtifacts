/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.eamonn.scraphviz.core

import java.io.{ FileWriter, InputStream }
import AbstractGraph._

trait AbstractGraph {

	var tag:String

	private var nodes = List[AbstractNode]()
	private var edges = List[AbstractEdge]()

	protected var label = "graph"

	var rankdir = 'TB

	private def basename = label.replaceAll("""\s""","_")

	def | {}

	def +- = edges.head.from

	def add(n:AbstractNode){ nodes ::= n }
	def add(e:AbstractEdge){ edges ::= e }

	def dot() {
		val out = new FileWriter(basename+".dot")
		out write tag+" G {\n"
		for( node <- nodes.reverse ){
			out write "  "+node.declaration+"\n"
		}
		for( edge <- edges ){
			out write "  "+edge+"\n"
		}
		out write "label=\""+label+"\"\n"
		out write "rankdir="+HasAtts.unquote(rankdir)+"\n"
		out.write("}\n")
		out.close()
	}

	def png() {
		dot()
		system("dot -Tpng -o "+basename+".png "+basename+".dot") 
	}
}

object AbstractGraph{
	private val runtime = Runtime.getRuntime

	private class Watcher(stream:InputStream) extends Thread{
		setDaemon(true)
		start()
		override def run(){
			while(true){
				val ch = stream.read
				if( ch == -1 ){
					return
				}
			  print(ch.toChar)
			}
		}
	}

	private def system(cmd:String){
		val process = runtime exec cmd
		new Watcher(process.getErrorStream)
		new Watcher(process.getInputStream)
		process.waitFor
		val status = process.exitValue
		if( status != 0 )
			throw new Exception(cmd+"\n  returned non-zero status "+status)
	}
}
