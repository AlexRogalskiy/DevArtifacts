/*
 * Transform.java
 * Copyright (c) 2005-2016 Radek Burget
 *
 * CSSBox is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *  
 * CSSBox is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *  
 * You should have received a copy of the GNU Lesser General Public License
 * along with CSSBox. If not, see <http://www.gnu.org/licenses/>.
 *
 * Created on 26. 11. 2016, 18:15:15 by burgetr
 */
package org.fit.cssbox.render;

import java.awt.Rectangle;
import java.awt.geom.AffineTransform;

import org.fit.cssbox.layout.CSSDecoder;
import org.fit.cssbox.layout.ElementBox;

import cz.vutbr.web.css.CSSProperty;
import cz.vutbr.web.css.Term;
import cz.vutbr.web.css.TermAngle;
import cz.vutbr.web.css.TermFunction;
import cz.vutbr.web.css.TermInteger;
import cz.vutbr.web.css.TermLengthOrPercent;
import cz.vutbr.web.css.TermList;
import cz.vutbr.web.css.TermNumber;

/**
 * Shared graphical transformation methods that may be shared among renderers.
 * 
 * @author burgetr
 */
public class Transform
{

    /**
     * Creates an AffineTransform that corresponds to the CSS transformations delared
     * for a given element.
     * @param elem The source element box.
     * @return an AffineTransform object describing the transformation or {@code null} when
     * no transformation should be applied on the given element.
     */
    public static AffineTransform createTransform(ElementBox elem)
    {
        if (elem.isBlock() || elem.isReplaced())
        {
            CSSDecoder dec = new CSSDecoder(elem.getVisualContext());
            Rectangle bounds = elem.getAbsoluteBorderBounds();
            //decode the origin
            int ox, oy;
            CSSProperty.TransformOrigin origin = elem.getStyle().getProperty("transform-origin");
            if (origin == CSSProperty.TransformOrigin.list_values)
            {
                TermList values = elem.getStyle().getValue(TermList.class, "transform-origin");
                ox = dec.getLength((TermLengthOrPercent) values.get(0), false, bounds.width / 2, 0, bounds.width);
                oy = dec.getLength((TermLengthOrPercent) values.get(1), false, bounds.height / 2, 0, bounds.height);
            }
            else
            {
                ox = bounds.width / 2;
                oy = bounds.height / 2;
            }
            ox += bounds.x;
            oy += bounds.y;
            //compute the transformation matrix
            AffineTransform ret = null;
            CSSProperty.Transform trans = elem.getStyle().getProperty("transform");
            if (trans == CSSProperty.Transform.list_values)
            {
                ret = new AffineTransform();
                ret.translate(ox, oy);
                TermList values = elem.getStyle().getValue(TermList.class, "transform");
                for (Term<?> term : values)
                {
                    if (term instanceof TermFunction)
                    {
                        final TermFunction func = (TermFunction) term;
                        final String fname = func.getFunctionName().toLowerCase();
                        if (fname.equals("rotate"))
                        {
                            if (func.size() == 1 && func.get(0) instanceof TermAngle)
                            {
                                double theta = dec.getAngle((TermAngle) func.get(0));
                                ret.rotate(theta);
                            }
                        }
                        else if (fname.equals("translate"))
                        {
                            if (func.size() == 1 && func.get(0) instanceof TermLengthOrPercent)
                            {
                                int tx = dec.getLength((TermLengthOrPercent) func.get(0), false, 0, 0, bounds.width);
                                ret.translate(tx, 0.0);
                            }
                            else if (func.size() == 2 && func.get(0) instanceof TermLengthOrPercent && func.get(1) instanceof TermLengthOrPercent)
                            {
                                int tx = dec.getLength((TermLengthOrPercent) func.get(0), false, 0, 0, bounds.width);
                                int ty = dec.getLength((TermLengthOrPercent) func.get(1), false, 0, 0, bounds.height);
                                ret.translate(tx, ty);
                            }
                        }
                        else if (fname.equals("translatex"))
                        {
                            if (func.size() == 1 && func.get(0) instanceof TermLengthOrPercent)
                            {
                                int tx = dec.getLength((TermLengthOrPercent) func.get(0), false, 0, 0, bounds.width);
                                ret.translate(tx, 0.0);
                            }
                        }
                        else if (fname.equals("translatey"))
                        {
                            if (func.size() == 1 && func.get(0) instanceof TermLengthOrPercent)
                            {
                                int ty = dec.getLength((TermLengthOrPercent) func.get(0), false, 0, 0, bounds.height);
                                ret.translate(0.0, ty);
                            }
                        }
                        else if (fname.equals("scale"))
                        {
                            if (func.size() == 1 && isNumber(func.get(0)))
                            {
                                float sx = getNumber(func.get(0));
                                ret.scale(sx, sx);
                            }
                            else if (func.size() == 2 && isNumber(func.get(0)) && isNumber(func.get(1)))
                            {
                                float sx = getNumber(func.get(0));
                                float sy = getNumber(func.get(1));
                                ret.scale(sx, sy);
                            }
                        }
                        else if (fname.equals("scalex"))
                        {
                            if (func.size() == 1 && isNumber(func.get(0)))
                            {
                                float sx = getNumber(func.get(0));
                                ret.scale(sx, 1.0);
                            }
                        }
                        else if (fname.equals("scaley"))
                        {
                            if (func.size() == 1 && isNumber(func.get(0)))
                            {
                                float sy = getNumber(func.get(0));
                                ret.scale(1.0, sy);
                            }
                        }
                        else if (fname.equals("skew"))
                        {
                            if (func.size() == 1 && func.get(0) instanceof TermAngle)
                            {
                                double ax = dec.getAngle((TermAngle) func.get(0));
                                ret.shear(Math.tan(ax), 0.0);
                            }
                            else if (func.size() == 2 && func.get(0) instanceof TermAngle && func.get(1) instanceof TermAngle)
                            {
                                double ax = dec.getAngle((TermAngle) func.get(0));
                                double ay = dec.getAngle((TermAngle) func.get(1));
                                ret.shear(Math.tan(ax), Math.tan(ay));
                            }
                        }
                        else if (fname.equals("skewx"))
                        {
                            if (func.size() == 1 && func.get(0) instanceof TermAngle)
                            {
                                double ax = dec.getAngle((TermAngle) func.get(0));
                                ret.shear(Math.tan(ax), 0.0);
                            }
                        }
                        else if (fname.equals("skewy"))
                        {
                            if (func.size() == 1 && func.get(0) instanceof TermAngle)
                            {
                                double ay = dec.getAngle((TermAngle) func.get(0));
                                ret.shear(0.0, Math.tan(ay));
                            }
                        }
                        else if (fname.equals("matrix"))
                        {
                            if (func.size() == 6)
                            {
                                double[] vals = new double[6];
                                boolean typesOk = true;
                                for (int i = 0; i < 6; i++)
                                {
                                    if (isNumber(func.get(i)))
                                        vals[i] = getNumber(func.get(i));
                                    else
                                        typesOk = false;
                                }
                                if (typesOk)
                                {
                                    ret.concatenate(new AffineTransform(vals));
                                }
                            }
                        }
                    }
                }
                ret.translate(-ox, -oy);
            }
            
            return ret;
        }
        else
            return null;
    }
    
    private static boolean isNumber(Term<?> term)
    {
        return term instanceof TermNumber || term instanceof TermInteger;
    }

    private static float getNumber(Term<?> term)
    {
        if (term instanceof TermNumber)
            return ((TermNumber) term).getValue();
        else
            return ((TermInteger) term).getValue();
    }
    
}
