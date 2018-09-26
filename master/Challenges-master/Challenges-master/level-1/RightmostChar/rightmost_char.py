import sys
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:       
        string, char = '', ''
        for line in data:
            string, char = line.strip().split(',')            
            print get_rightmost_position(string, char)    
    

def get_rightmost_position(string, char):
    return string.rfind(char)


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)

