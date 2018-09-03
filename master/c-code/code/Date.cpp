#include "Date.h"
#include <iostream>
using namespace std;

#if VERSION == 1

  // Version #1: Access fields
JNIEXPORT void JNICALL
Java_Date_printDate( JNIEnv * env, jobject ths )
{
    jclass cls = env->GetObjectClass( ths );

    jfieldID monthID = env->GetFieldID( cls, "month", "I" );
    jfieldID dayID =   env->GetFieldID( cls, "day", "I" );
    jfieldID yearID =  env->GetFieldID( cls, "year", "I" );

    jint m = env->GetIntField( ths, monthID );
    jint d = env->GetIntField( ths, dayID );
    jint y = env->GetIntField( ths, yearID );

    cout << "(version 1) " << m << "/" << d << "/" << y << endl; 
}

#elif VERSION == 2

  // Version #2: Invoke accessor methods
JNIEXPORT void JNICALL
Java_Date_printDate( JNIEnv * env, jobject ths )
{
    jclass cls = env->GetObjectClass( ths );

    jmethodID getMonthID = env->GetMethodID( cls, "getMonth", "()I" );
    jmethodID getDayID   = env->GetMethodID( cls, "getDay", "()I" );
    jmethodID getYearID  = env->GetMethodID( cls, "getYear", "()I" );

    jint m = env->CallIntMethod( ths, getMonthID );
    jint d = env->CallIntMethod( ths, getDayID );
    jint y = env->CallIntMethod( ths, getYearID );

    cout << "(version 2) " << m << "/" << d << "/" << y << endl; 
}

#else

  // Version #3: Invoke toString
JNIEXPORT void JNICALL
Java_Date_printDate( JNIEnv * env, jobject ths )
{
    jclass cls = env->GetObjectClass( ths );
    
    jmethodID toStringID = env->GetMethodID( cls, "toString",
                                       "()Ljava/lang/String;" );

    jstring str = (jstring) env->CallObjectMethod( ths,
                                                   toStringID );

    const char *c_ret = env->GetStringUTFChars( str, NULL );
    cout << "(version 3) " << c_ret << endl;
    env->ReleaseStringUTFChars( str, c_ret );
}

#endif