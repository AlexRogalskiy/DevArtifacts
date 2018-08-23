/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.eamonn.scraphviz.core

/** an arc drawn between two nodes in a graph */
abstract class AbstractEdge(g:AbstractGraph, 
														val from:AbstractNode, 
														to:AbstractNode)
	extends HasAtts
{

  g add this

  /** Set the edge style.  Value must be one of "dashed", "dotted",
    * "solid", "invis" and "bold" */
  def style(s:Symbol) = { att( 'style, s );     this }

	def label(s:String) = { att( 'label, s );     this }

	def color(s:String) = { att( 'color, s ); att('fontcolor,s);    this }

	def fontsize(s:Float) = { att( 'fontsize, s );     this }

  def headlabel(s:String) = { att( 'headlabel, s ); this }

  def taillabel(s:String) = { att( 'taillabel, s ); this }

  def constraint(s:Boolean) = { att( 'constraint, s ); this }
}
