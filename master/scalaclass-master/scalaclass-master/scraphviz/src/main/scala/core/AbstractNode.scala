/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.eamonn.scraphviz.core

abstract class AbstractNode( graph:AbstractGraph, name:String ) extends HasAtts{

  graph add this

  def shape(sh:Symbol) = { att('shape,sh); this }

  def style(sh:Symbol) = { att('style,sh); this }

  def label(lab:String) = { att('label,lab); this }

	def color(s:String) = { att( 'color, s ); att('fontcolor,s);    this }

	def fontsize(s:Float) = { att( 'fontsize, s );     this }

  override def toString = "\""+name+"\""
  def declaration = this+" "+atts
}
