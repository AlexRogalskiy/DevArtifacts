#                                               -*- Autoconf -*-
# Process this file with autoconf to produce a configure script.

AC_PREREQ([2.61])
AC_INIT([Jupiter], [1.0], [jupiter-bugs@example.org])
AC_CONFIG_SRCDIR([src/main.c])
AC_CONFIG_HEADERS([config.h])

# Checks for programs.
AC_PROG_CC
AC_PROG_INSTALL
AC_CHECK_PROGS([DOXYGEN], [doxygen])

# Checks for header files.
AC_CHECK_HEADERS([stdlib.h])

# Checks for libraries.
# Checks for typedefs, structures, and compiler characteristics.
# Checks for library functions.

AC_CONFIG_FILES([Makefile
                 src/Makefile])
AC_OUTPUT

echo \
"-------------------------------------------------

 ${PACKAGE_NAME} Version ${PACKAGE_VERSION}

 Prefix: '${prefix}'.
 Compiler: '${CC} ${CFLAGS} ${CPPFLAGS}'

 Package features:
   Async Execution: ${async_exec}

 Now type 'make @<:@<target>@:>@'
   where the optional <target> is:
     all                - build all binaries
     install            - install everything

--------------------------------------------------"
