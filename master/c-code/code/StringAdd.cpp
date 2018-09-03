#include "StringAdd.h"
#include <iostream>
#include <string>
using namespace std;


#if VERSION == 1

  // Version 1
JNIEXPORT jstring JNICALL Java_StringAdd_add
  ( JNIEnv *env, jclass cls, jstring a, jstring b )
{
    const char *a1 = env->GetStringUTFChars( a, NULL );
    const char *b1 = env->GetStringUTFChars( b, NULL );
    char *c = new char[ strlen( a1 ) + strlen( b1 ) + 1 ];

    strcpy( c, a1 );
    strcat( c, b1 );
    jstring result = env->NewStringUTF( c );

    env->ReleaseStringUTFChars( a, a1 );
    env->ReleaseStringUTFChars( b, b1 );
    delete [] c;

    return result;
}


#else

JNIEXPORT jstring JNICALL Java_StringAdd_add
  ( JNIEnv *env, jclass cls, jstring a, jstring b )
{
    const char *a1 = env->GetStringUTFChars( a, NULL );
    const char *b1 = env->GetStringUTFChars( b, NULL );

    string c = a1;
    c += b1;
    jstring result = env->NewStringUTF( c.c_str( ) );

    env->ReleaseStringUTFChars( a, a1 );
    env->ReleaseStringUTFChars( b, b1 );

    return result;
}

#endif