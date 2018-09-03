#include <iostream>
using namespace std;
#include "HelloNative.h"

JNIEXPORT void JNICALL
Java_HelloNative_hello( JNIEnv *env, jclass cls )
{
    cout << "Hello world" << endl;
}
