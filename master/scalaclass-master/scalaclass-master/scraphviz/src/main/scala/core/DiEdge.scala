/* Copyright (c) 2010 Eamonn O'Brien-Strain, eob@well.com
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which is available at http://www.eclipse.org/legal/epl-v10.html
 */
package org.eamonn.scraphviz.core

class DiEdge(g:AbstractGraph, from:DiNode, to:DiNode) 
	extends AbstractEdge(g,from,to)
{
  override def toString =  from+" -> "+to+" "+atts


  def arrowhead(s:Symbol) = { att( 'arrowhead, s ); this }
  def arrowtail(s:Symbol) = { att( 'arrowtail, s ); this }
  def arrowsize(s:Float)  = { att( 'arrowsize, s ); this }

}
