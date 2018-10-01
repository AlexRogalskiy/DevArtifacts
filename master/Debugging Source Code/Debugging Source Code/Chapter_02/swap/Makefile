TARGET = swap
CFLAGS = -g3 -Wall -Wextra

all: $(TARGET)

$(TARGET): main.o swapper.o
	$(CC) -o $@ $^

.PHONY:

clean:
	$(RM) $(TARGET) a.out core *.o
