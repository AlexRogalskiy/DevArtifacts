import sys, os

def main(input_file):    
    with open(input_file, 'r') as data:
        for line in data:           
            print sum_of_digits(line.strip())


def sum_of_digits(digit):
    return sum([ int(ch) for ch in str(digit) ])

if __name__ == "__main__":
    # first argument must be a text file
    try:
        main(sys.argv[1])
    except Exception as e:                  
        print 'First argument must be a text file!\nError: {0}'.format(e)