import sys
 
def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:
            string, chars = line.strip().split(',')
            print remove_chars(string, chars.strip())


def remove_chars(string, chars):	
	for ch in chars:
		string = string.replace(ch, '')
	return string

if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)