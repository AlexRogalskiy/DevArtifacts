// Invoke the main method of Hello
#include <iostream>
#include <jni.h>
using namespace std;

const char *CLASS_NAME = "Hello";

int main( int argc, char *argv[] )
{
    JavaVMInitArgs vm_args;
    JavaVMOption options[ 1 ];
    JavaVM *vm;
    JNIEnv *env;

    options[ 0 ].optionString = "-Djava.class.path=.";
    vm_args.options = options;
    vm_args.nOptions = 1;
    vm_args.version = JNI_VERSION_1_2;

    int res = JNI_CreateJavaVM( &vm, (void **)&env, &vm_args );
    if( res < 0 )
    {
        cerr << "Failed to create VM (" << res << ")" << endl;
        return -1;
    }

    jclass cls = env->FindClass( CLASS_NAME );

      // Now try to call main
    jmethodID mainMethodID = env->GetStaticMethodID( cls, "main",
                                      "([Ljava/lang/String;)V" );
    jclass classString = env->FindClass( "java.lang.String" );
    jobjectArray argsToMain =
                       env->NewObjectArray(0, classString, NULL);
    env->CallStaticVoidMethod( cls, mainMethodID, argsToMain );

    vm->DestroyJavaVM( );

    return 0;
}