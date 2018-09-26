import sys
 
def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:
            print capitalize_words(line.strip())

def capitalize_words(string):
	data, output = string.split(), []
	return " ".join([ word[0].upper() + word[1:] for word in data ])

if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)


test = 'test javaScript language'

data = test.split()
print data
output = []
for i in data:
	output.append(i[0].upper() + i[1:])
print output
















