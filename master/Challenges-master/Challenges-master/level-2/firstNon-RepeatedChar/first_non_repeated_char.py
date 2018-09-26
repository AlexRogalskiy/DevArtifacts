import sys
 
def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:            
            print first_non_repeated_char(line.strip())


def first_non_repeated_char(string):
	output = None
	for char in string:
		if string.count(char) == 1:
			output = char
			# for first non-repeated char need to break loop
			break
	return output

if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)