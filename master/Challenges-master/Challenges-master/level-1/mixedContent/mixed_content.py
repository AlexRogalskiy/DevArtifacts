import sys
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:
        for line in data:                              
            print get_content(line.strip()) 
    

def get_content(line):
    digits, words, output = [], [], ''
    mixed_array = line.split(',')
    
    for element in mixed_array:
        if element.isdigit():
            digits.append(element)
        else:
            words.append(element)
    
    if digits and words:
        output = '{0}|{1}'.format(','.join(words), ','.join(digits))
    else:
        output = ','.join(digits) or ','.join(words)
    
    return output




if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)