import sys

def main(input_file):    
    with open(input_file, 'r') as data:
        for line in data:
            # convert str list to int and unpack to variables
            x, y, n = map(int, line.split())
            print fizzbuzz(x, y, n)


def fizzbuzz(x, y, n):
    result = []
    for i in xrange(1, n + 1):
        if i % x == 0 and i % y == 0:
            result.append('FB')
        elif i % x == 0:
            result.append('F')
        elif i % y == 0:
            result.append('B')
        else:
            result.append(str(i))  
    return " ".join(result)


if __name__ == "__main__":
    # first argument must be a text file
    try:
        main(sys.argv[1])
    except Exception:
        print 'First argument must be a text file!'