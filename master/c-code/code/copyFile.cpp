#include <stdio.h>
#include <string.h>

// Copy files; return number of chars copied
int copy( const char *destFile, const char *sourceFile )
{
    int charsCounted = 0;
    int ch;
    FILE *sfp, *dfp;

    if( strcmp( sourceFile, destFile ) == 0 )
    {
        fprintf( stderr, "Cannot copy to self\n" );
        return -1;
    }
    if( ( sfp = fopen( sourceFile, "rb" ) ) == NULL )
    {
        fprintf( stderr, "Bad input file %s\n", sourceFile );
        return -1;
    }
    if( ( dfp = fopen( destFile, "wb" ) ) == NULL )
    {
        fprintf( stderr, "Bad output file %s\n", destFile );
        fclose( sfp );
        return -1;
    }

    while( ( ch = getc( sfp ) ) != EOF )
        if( putc( ch, dfp ) == EOF )
        {
            fprintf( stderr, "Unexpected write error.\n" );
            break;
        }
        else
            charsCounted++;

    fclose( sfp );
    fclose( dfp );
    return charsCounted;
}

int main( )
{
    copy( "copy1.exe", "copyFile.exe" );

    return 0;
}