import sys
 
def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:
            print is_even(int(line.strip()))


def is_even(number):
	return 1 if number % 2 == 0 else 0

if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)