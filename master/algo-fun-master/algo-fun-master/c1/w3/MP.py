# Uses python3
import sys

def summands(n):
   
    summands = [1]
    n -= 1
    while n:
        last_element = summands[-1]
        if (last_element + 1) * 2 <= n:
            n -= last_element + 1
            summands.append(last_element + 1)
        else:
            if last_element >= n:
                n += summands.pop()
            summands.append(n)
            n = 0

    return summands

if __name__ == "__main__":
    input = sys.stdin.read()
    n = int(input)
    summands = summands(n)
    print(len(summands))
    for x in summands:
        print(x, end=" ")