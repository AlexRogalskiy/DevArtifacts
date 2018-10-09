/*
 * ContentObserver.java
 * Copyright (c) 2005-2017 Radek Burget
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
 * Created on 19. 9. 2017, 12:59:02 by burgetr
 */
package org.fit.cssbox.io;

import java.net.URL;

/**
 * An observer that tracks the content loading (e.g. loading images).
 * 
 * @author dedrakot
 */
public interface ContentObserver
{
    
    /**
     * This method is called when some content failed to load.
     * @param url the content URL
     */
    public void contentLoadFailed(URL url);

}
