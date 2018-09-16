package edu.princeton.cs.introcs;

/******************************************************************************
 *  Compilation:  javac StopwatchCPU.java
 *  Execution:    none
 *  Dependencies: none
 *
 *  A version of Stopwatch.java that measures CPU time on a single
 *  core or processor (instead of wall clock time).
 *
 ******************************************************************************/

import java.lang.management.ThreadMXBean;
import java.lang.management.ManagementFactory;

/**
 *  The {@code StopwatchCPU} data type is for measuring
 *  the CPU time used during a programming task.
 *
 *  See {@link Stopwatch} for a version that measures wall-clock time
 *  (the real time that elapses).
 *
 *  @author Josh Hug
 *  @author Robert Sedgewick
 *  @author Kevin Wayne
 */

public class StopwatchCPU {
    private static final double NANOSECONDS_PER_SECOND = 1000000000;

    private final ThreadMXBean threadTimer;
    private final long start;
            
    /**
     * Initializes a new stopwatch.
     */
    public StopwatchCPU() {  
        threadTimer = ManagementFactory.getThreadMXBean();
        start = threadTimer.getCurrentThreadCpuTime();
    }   
        
    /**
     * Returns the elapsed CPU time (in seconds) since the stopwatch was created.
     *
     * @return elapsed CPU time (in seconds) since the stopwatch was created
     */
    public double elapsedTime() {
        long now = threadTimer.getCurrentThreadCpuTime();
        return (now - start) / NANOSECONDS_PER_SECOND;
    }   
}


/*************************************************************************
 *  Copyright 2002-2012, Robert Sedgewick and Kevin Wayne.
 *
 *  This file is part of stdlib-package.jar, which accompanies the textbook
 *
 *      Introduction to Programming in Java: An Interdisciplinary Approach
 *      by R. Sedgewick and K. Wayne, Addison-Wesley, 2007. ISBN 0-321-49805-4.
 *
 *      http://introcs.cs.princeton.edu
 *
 *
 *  stdlib-package.jar is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  stdlib-package.jar is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with stdlib-package.jar.  If not, see http://www.gnu.org/licenses.
 *************************************************************************/

