import sys

chars_to_digit = {
    'a': '0',
    'b': '1',
    'c': '2',
    'd': '3',
    'e': '4',
    'f': '5',
    'g': '6',
    'h': '7',
    'i': '8',
    'j': '9'
 }

 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:
        for line in data:                              
            print find_hidden(line.strip()) 
    

def find_hidden(line):
    result = []
    keys = chars_to_digit.keys()
    line_list = list(line)

    for char in line_list:
        if char in keys:
            result.append(chars_to_digit[char])
        elif char.isdigit():
            result.append(char)
    
    result = "".join(result) if result else 'NONE'
    return result


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)