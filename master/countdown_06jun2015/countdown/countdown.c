/* countdown - count down a specified time interval
**
** Copyright © 2012,2014,2015 by Jef Poskanzer <jef@mail.acme.com>.
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
**
** For commentary on this license please see http://acme.com/license.html
*/

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/time.h>
#include <ctype.h>

#define MINUTE 60
#define HOUR (60*MINUTE)
#define DAY (24*HOUR)
#define WEEK (7*DAY)


static char* argv0;


static void usage( void )  __attribute__ ((noreturn));
static double time_f( void );


int
main( int argc, char** argv )
    {
    char* interval;
    size_t interval_len;
    int scan_len;
    double now, end;
    time_t t;
    struct tm tm;
    char ap, u1, u2;
    double d1, d2;
    int i1, i2, i3;
    int mul1, mul2;
    long seconds;
    int i;

    argv0 = argv[0];
    if ( argc != 2 )
	usage();
    interval = argv[1];
    interval_len = strlen( argv[1] );

    /* Parse the interval */
    now = time_f();
    t = time( (time_t*) 0 );
    (void) localtime_r( &t, &tm );
    if ( sscanf( interval, "%d:%d:%d%cm%n", &i1, &i2, &i3, &ap, &scan_len ) == 4 && scan_len == interval_len )
	{
	ap = tolower( ap );
	if ( ap != 'a' && ap != 'p' )
	    usage();
	tm.tm_hour = i1;
	if ( ap == 'p' && tm.tm_hour < 12 )
	    tm.tm_hour += 12;
	tm.tm_min = i2;
	tm.tm_sec = i3;
	end = mktime( &tm );
	while ( end < now )
	    end += DAY;
	}
    else if ( sscanf( interval, "%d:%d:%d%n", &i1, &i2, &i3, &scan_len ) == 3 && scan_len == interval_len )
	{
	tm.tm_hour = i1;
	tm.tm_min = i2;
	tm.tm_sec = i3;
	end = mktime( &tm );
	while ( end < now )
	    {
	    if ( i1 > 12 )
		end += DAY;
	    else
		end += 12 * HOUR;
	    }
	}
    else if ( sscanf( interval, "%d:%d%cm%n", &i1, &i2, &ap, &scan_len ) == 3 && scan_len == interval_len )
	{
	ap = tolower( ap );
	if ( ap != 'a' && ap != 'p' )
	    usage();
	tm.tm_hour = i1;
	if ( ap == 'p' && tm.tm_hour < 12 )
	    tm.tm_hour += 12;
	tm.tm_min = i2;
	tm.tm_sec = 0;
	end = mktime( &tm );
	while ( end < now )
	    end += DAY;
	}
    else if ( sscanf( interval, "%d:%d%n", &i1, &i2, &scan_len ) == 2 && scan_len == interval_len )
	{
	tm.tm_hour = i1;
	tm.tm_min = i2;
	tm.tm_sec = 0;
	end = mktime( &tm );
	while ( end < now )
	    {
	    if ( i1 > 12 )
		end += DAY;
	    else
		end += 12 * HOUR;
	    }
	}
    else if ( sscanf( interval, "%lf%c%lf%c%n", &d1, &u1, &d2, &u2, &scan_len ) == 4 && scan_len == interval_len )
	{
	u1 = tolower( u1 );
	u2 = tolower( u2 );
	switch ( u1 )
	    {
	    case 's': mul1 = 1; break;
	    case 'm': mul1 = MINUTE; break;
	    case 'h': mul1 = HOUR; break;
	    case 'd': mul1 = DAY; break;
	    case 'w': mul1 = WEEK; break;
	    default: usage();
	    }
	switch ( u2 )
	    {
	    case 's': mul2 = 1; break;
	    case 'm': mul2 = MINUTE; break;
	    case 'h': mul2 = HOUR; break;
	    case 'd': mul2 = DAY; break;
	    case 'w': mul2 = WEEK; break;
	    default: usage();
	    }
	end = now + d1 * mul1 + d2 * mul2;
	}
    else if ( sscanf( interval, "%lf%c%n", &d1, &u1, &scan_len ) == 2 && scan_len == interval_len )
	{
	u1 = tolower( u1 );
	switch ( u1 )
	    {
	    case 's': mul1 = 1; break;
	    case 'm': mul1 = MINUTE; break;
	    case 'h': mul1 = HOUR; break;
	    case 'd': mul1 = DAY; break;
	    case 'w': mul1 = WEEK; break;
	    default: usage();
	    }
	end = now + d1 * mul1;
	}
    else if ( sscanf( interval, "%lf%n", &d1, &scan_len ) == 1 && scan_len == interval_len )
	end = now + d1;
    else
	usage();

    /* Do the countdown. */
    for (;;)
	{
	now = time_f();
	seconds = ( end - now ) + 0.5;
	if ( seconds >= DAY )
	    {
	    (void) printf( "\r%ldd %ldh %ldm %lds   ", seconds / DAY, ( seconds % DAY ) / HOUR, ( seconds % HOUR ) / MINUTE, seconds % MINUTE );
	    }
	else if ( seconds >= HOUR )
	    (void) printf( "\r%ldh %ldm %lds   ", seconds / HOUR, ( seconds % HOUR ) / MINUTE, seconds % MINUTE );
	else if ( seconds >= MINUTE )
	    (void) printf( "\r%ldm %lds   ", seconds / MINUTE, seconds % MINUTE );
	else
	    (void) printf( "\r%lds   ", seconds );
	(void) fflush( stdout );
	if ( now >= end )
	    break;
	usleep( 200000 );
	}

    /* Alarm. */
    (void) printf( "\n" );
    for ( i = 0; i < 5; ++i )
	{
	(void) putchar( '' );
	(void) fflush( stdout );
	sleep( 1 );
	}

    exit( EXIT_SUCCESS );
    }


static void
usage( void )
    {
    (void) fprintf( stderr, "usage:  %s interval\n", argv0 );
    exit( EXIT_FAILURE );
    }


static double
time_f( void )
    {
    struct timeval tv;

    (void) gettimeofday( &tv, NULL );
    return (double) tv.tv_sec + (double) tv.tv_usec / 1000000.0;
    }
