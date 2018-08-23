/* randomize - shuffle lines in a file
**
** Copyright (C) 1993,2000,2009 by Jef Poskanzer <jef@mail.acme.com>.
** All rights reserved.
**
** Redistribution and use in source and binary forms, with or without
** modification, are permitted provided that the following conditions
** are met:
** 1. Redistributions of source code must retain the above copyright
**    notice, this list of conditions and the following disclaimer.
** 2. Redistributions in binary form must reproduce the above copyright
**    notice, this list of conditions and the following disclaimer in the
**    documentation and/or other materials provided with the distribution.
**
** THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
** ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
** IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
** ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
** FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
** DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
** OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
** HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
** LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
** OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
** SUCH DAMAGE.
*/


#include <stdlib.h>
#include <stdio.h>
#include <string.h>


int
main( int argc, char** argv )
    {
    FILE* f;
    int i, j, maxlines, nlines;
    char line[50000];
    char** lines;
    char* t;

#ifdef linux
    /* Linux does not have srandomdev(). */
    srandom( (unsigned long) time( NULL ) );
#else
    srandomdev();
#endif

    maxlines = 500;
    lines = (char**) malloc( maxlines * sizeof(char*) );
    nlines = 0;

    if ( argc == 1 )
	{
	while ( fgets( line, sizeof(line), stdin ) != NULL )
	    {
	    if ( nlines >= maxlines )
		{
		maxlines *= 2;
		lines = (char**) realloc(
		    (char*) lines, maxlines * sizeof(char*) );
		}
	    lines[nlines] = (char*) malloc( strlen( line ) + 1 );
	    (void) strcpy( lines[nlines], line );
	    ++nlines;
	    }
	}
    else
	for ( i = 1; i < argc; ++i )
	    {
	    if ( strcmp( argv[i], "-" ) == 0 )
		f = stdin;
	    else
		{
		f = fopen( argv[i], "r" );
		if ( f == (FILE*) 0 )
		    {
		    perror( argv[i] );
		    exit( 1 );
		    }
		}
	    while ( fgets( line, sizeof(line), f ) != NULL )
		{
		if ( nlines >= maxlines )
		    {
		    maxlines *= 2;
		    lines = (char**) realloc(
			(char*) lines, maxlines * sizeof(char*) );
		    }
		lines[nlines] = (char*) malloc( strlen( line ) + 1 );
		(void) strcpy( lines[nlines], line );
		++nlines;
		}
	    if ( f != stdin )
		(void) fclose( f );
	    }

    /* Fisher-Yates shuffle. */
    for ( i = nlines - 1; i >= 1; --i )
	{
	j = random() % ( i + 1 );
	t = lines[j];
	lines[j] = lines[i];
	lines[i] = t;
	}

    for ( i = 0; i < nlines; ++i )
	fputs( lines[i], stdout );

    exit( 0 );
    }
