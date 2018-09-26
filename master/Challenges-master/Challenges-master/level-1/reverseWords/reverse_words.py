import sys

def main(input_file):    
    with open(input_file, 'r') as data:
        for line in data:
            print reverse_words(line)


def reverse_words(string):
    return " ".join(string.split()[::-1])

if __name__ == "__main__":
    # first argument must be a text file
    try:
        main(sys.argv[1])
    except Exception:
        print 'First argument must be a text file!'