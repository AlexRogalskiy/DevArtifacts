# Makefile for countdown

BINDIR =	/usr/local/bin
MANDIR =	/usr/local/man/man1
CC =		cc
CFLAGS =	-O -ansi -pedantic -U__STRICT_ANSI__ -Wall -Wpointer-arith -Wshadow -Wcast-qual -Wcast-align -Wstrict-prototypes -Wmissing-prototypes -Wmissing-declarations -Wredundant-decls -Wno-long-long
LDFLAGS =	-s

all:		countdown

countdown:	countdown.c
	$(CC) $(CFLAGS) countdown.c $(LDFLAGS) -o countdown


install:	all
	rm -f $(BINDIR)/countdown
	cp countdown $(BINDIR)/countdown
	rm -f $(MANDIR)/countdown.1
	cp countdown.1 $(MANDIR)/countdown.1

clean:
	rm -f countdown *.o core core.* *.core
