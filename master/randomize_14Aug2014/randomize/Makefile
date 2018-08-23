BINDIR =	/usr/local/bin
MANDIR =	/usr/local/man/man1
CC =		cc
CFLAGS =	-O -ansi -pedantic -U__STRICT_ANSI__ -Wall -Wpointer-arith -Wshadow -Wcast-qual -Wcast-align -Wstrict-prototypes -Wmissing-prototypes -Wmissing-declarations -Wredundant-decls -Wno-long-long
LDFLAGS =	-s

all:		randomize

randomize:	randomize.c
	${CC} ${CFLAGS} randomize.c ${LDFLAGS} -o randomize

install:	all
	rm -f ${BINDIR}/randomize
	cp randomize ${BINDIR}/randomize
	rm -f ${MANDIR}/randomize.1
	cp randomize.1 ${MANDIR}/randomize.1

clean:
	rm -f randomize *.o core core.* *.core
