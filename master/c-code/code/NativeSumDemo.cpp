#include <iostream>
#include "NativeSumDemo.h"
using namespace std;


#if VERSION == 1

  // Version 1: no exceptions
JNIEXPORT jdouble JNICALL Java_NativeSumDemo_sum
  ( JNIEnv *env, jclass cls, jdoubleArray arr )
{
    jdouble sum = 0;
    jsize len = env->GetArrayLength( arr );

      // Get the elements; don't care to know if copied or not
    jdouble *a = env->GetDoubleArrayElements( arr, NULL );

    for( jsize i = 0; i < len; i++ )
        sum += a[ i ];

      // Release elements; no need to flush back
    env->ReleaseDoubleArrayElements( arr, a, JNI_ABORT );

    return sum;
}


#else


#include "NativeSumDemo.h"

JNIEXPORT jdouble JNICALL Java_NativeSumDemo_sum
  ( JNIEnv *env, jclass cls, jdoubleArray arr) 
{
    jdouble sum = 0;
    jsize len = env->GetArrayLength( arr );
    
    if( len == 0 )
    {
        env->ThrowNew( env->FindClass( "java/lang/Exception" ),
                                       "Empty array" );
        cout << "Throwing an exception, but should exit" << endl;
        return 0.0;
    }
    
      // Get the elements; don't care to know if copied or not
    jdouble *a = env->GetDoubleArrayElements( arr, NULL );
    
    for( jsize i = 0; i < len; i++ )
        sum += a[ i ];
        
      // Release elements; no need to flush back
    env->ReleaseDoubleArrayElements( arr, a, JNI_ABORT );
    
    return sum;
}


#endif