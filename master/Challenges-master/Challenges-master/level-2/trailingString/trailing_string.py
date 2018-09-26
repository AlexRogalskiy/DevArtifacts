import sys
 
def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:
            string, word = line.strip().split(',')
            print is_trailing_string(string, word.strip())


def is_trailing_string(string, word):
    return 1 if word == string[-len(word):] else 0

if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)