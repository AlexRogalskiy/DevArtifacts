#include <string.h>
#include <stdlib.h>
#include "StringAdd.h"

JNIEXPORT jstring JNICALL Java_StringAdd_add
  ( JNIEnv *env, jclass cl, jstring a, jstring b )
{
    const char *a1 = (*env)->GetStringUTFChars( env, a, NULL );
    const char *b1 = (*env)->GetStringUTFChars( env, b, NULL );
    char *c = (char *) malloc( strlen(a1) + strlen(b1) + 1 );
    jstring result;

    strcpy( c, a1 );
    strcat( c, b1 );
    result = (*env)->NewStringUTF( env, c );

    (*env)->ReleaseStringUTFChars( env, a, a1 );
    (*env)->ReleaseStringUTFChars( env, b, b1 );
    free( c );

    return result;
}