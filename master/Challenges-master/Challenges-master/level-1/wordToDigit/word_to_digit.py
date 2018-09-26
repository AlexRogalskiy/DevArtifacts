import sys

DIGITS_WORDS = {
	'zero': 	0,
	'one': 		1,
	'two': 		2,
	'three': 	3,
	'four': 	4,
	'five': 	5,
	'six': 		6,
	'seven': 	7,
	'eight': 	8,
	'nine': 	9
}

 
def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:            
            print get_digits_string(line.strip(), DIGITS_WORDS)


def get_digits_string(words, dictionary):
	words, output = words.split(';'), []
	for e in words:
		output.append(str(dictionary[e]))
	return "".join(output)


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)