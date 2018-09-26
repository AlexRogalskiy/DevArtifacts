import sys
 
def main(input_file):
    output = []   
    with open(input_file, 'r') as data:       
        for line in data:
            output.append(line.strip())
    return longest_lines(output)


def longest_lines(input_list):
    chunk = int(input_list.pop(0))
    return sorted(input_list, key=len)[::-1][:chunk]


def print_lines(input_list):
    for line in input_list:
        print line


if __name__ == "__main__":    
    try:
        print_lines(main(sys.argv[1]))
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)