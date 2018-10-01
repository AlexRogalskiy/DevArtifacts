_fifo.so:  fifo.o fifo_wrap.o
	gcc -shared fifo.o fifo_wrap.o -o _fifo.so

fifo.o fifo_wrap.o:  fifo.c fifo_wrap.c
	gcc -fPIC -g -c fifo.c fifo_wrap.c -I/usr/include/python2.4

fifo.py fifo_wrap.c:  fifo.i
	swig -python fifo.i
