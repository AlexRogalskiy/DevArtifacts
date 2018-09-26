import sys
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:
        for line in data:                              
            print read_more(line.strip()) 
    

def read_more(line):
    output = line
    if len(line) > 55:
        output = output[:output[:40].rfind(' ')] + '... <Read More>'
    return output


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)