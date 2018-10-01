CFLAGS	?= -g -O0

all: jupiter

jupiter: main.c
	$(CC) $(CFLAGS) $(CPPFLAGS) -o $@ main.c 

clean:
	-rm jupiter >/dev/null 2>&1

check: all
	./jupiter | grep "Hello from .*jupiter!"
	@echo "*** All TESTS PASSED"

install:
	install -d $(DESTDIR)$(bindir)
	install -m 0755 jupiter $(DESTDIR)$(bindir)

uninstall:
	-rm $(DESTDIR)$(bindir)/jupiter >/dev/null 2>&1

.PHONY: all clean check install uninstall
