TARGET = outOfBoundWithEfence outOfBoundWithoutEfence
CC     = gcc
CFLAGS = -g3 -Wall -Wextra -std=c99


all: $(TARGET)

outOfBoundWithEfence:
	gcc $(CFLAGS) outOfBound.c -o outOfBoundWithEfence -lefence

outOfBoundWithoutEfence:
	gcc $(CFLAGS) outOfBound.c -o outOfBoundWithoutEfence

.PHONY: clean

clean:
	$(RM) core $(TARGET)
