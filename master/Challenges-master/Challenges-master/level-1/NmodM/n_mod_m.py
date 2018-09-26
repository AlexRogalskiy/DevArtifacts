import sys

def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:
            n, m = line.strip().split(',')
            if int(m) != 0:
            	print my_mod(int(n), int(m))


def my_mod(n, m):
	result = 0
	if n < m:
		result = abs(n)
	elif n > m:
		while (n > m):
			result = n - m
			n = result
	return result


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)