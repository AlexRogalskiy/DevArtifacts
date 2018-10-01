#if HAVE_CONFIG_H
# include <config.h>
#endif

#include "jupcommon.h"

#include <stdio.h>
#include <stdlib.h>

#if HAVE_PTHREAD_H
# include <pthread.h>
#endif

static void * print_it(void * data)
{
    const char ** strings = (const char **)data;
    printf("%s from %s!\n", strings[0], strings[1]);
    return 0;
}

int print_routine(const char * salutation, const char * name)
{
    const char * strings[] = {salutation, name};
#if ASYNC_EXEC
    pthread_t tid;
    pthread_create(&tid, 0, print_it, strings);
    pthread_join(tid, 0);
#else
    print_it(name);
#endif
    return 0;
}
