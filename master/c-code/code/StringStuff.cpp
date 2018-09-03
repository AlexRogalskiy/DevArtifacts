#include "StringStuff.h"
#include <string.h>

JNIEXPORT jint JNICALL Java_StringStuff_totalChars
  ( JNIEnv *env, jclass cls, jobjectArray arr) 
{
    jint totalChars = 0;
    jsize len = env->GetArrayLength( arr );

    for( jint i = 0; i < len; i++ )
    {
        jstring jstr = (jstring)
                           env->GetObjectArrayElement( arr, i );
        if( jstr == NULL )
            continue;
        const char *cstr = env->GetStringUTFChars( jstr, NULL );
        totalChars += strlen( cstr );

        env->ReleaseStringUTFChars( jstr, cstr );
        env->DeleteLocalRef( jstr );
    }

    return totalChars;
}