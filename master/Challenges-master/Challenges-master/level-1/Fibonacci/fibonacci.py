import sys
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:       
        for line in data:
            output.append(fibonacci(int(line.strip())))  
    return output


def fibonacci(n):
    a, b, next = 0, 1, 0    
    if n <= 1:
        return n
    else:
        while (n > 1):
            next = a + b
            a, b = b, next
            n -= 1
    return next


def print_lines(input_list):
    for line in input_list:
        print line

if __name__ == "__main__":    
    try:
       print_lines(main(sys.argv[1]))
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)