import sys
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:
        for line in data:                              
            print get_lowest_unique_number(line.strip()) 
    

def get_lowest_unique_number(line):
    output, digits = {}, line.split()
    index = 0
    uniques = []
    
    for e in digits:
        if e not in output.keys():
            output[e] = 1
        else:
            output[e] += 1
    
    uniques = get_only_unique_numbers(output)  
    if uniques:
        index = digits.index(min(uniques)) + 1
    return index 


def get_only_unique_numbers(numbers):
    output = []
    for k, v in numbers.iteritems():
        if v == 1:
           output.append(k)
    return output


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)