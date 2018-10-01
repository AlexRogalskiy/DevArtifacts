# testfifo.py

import fifo

def main():
   fifo.fifoinit(100)
   fifo.fifoput('x')
   fifo.fifoput('c')
   c = fifo.fifoget() 
   print c
   c = fifo.fifoget() 
   print c

if __name__ == '__main__': main() 
