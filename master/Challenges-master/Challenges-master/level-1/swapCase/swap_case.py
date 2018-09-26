import sys
 
def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:
            print swap_case(line.strip())


def swap_case(string):
    output = ''
    for char in string:
        if char.islower():
           output += char.upper()
        else:
            output += char.lower()            
    return output

if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)