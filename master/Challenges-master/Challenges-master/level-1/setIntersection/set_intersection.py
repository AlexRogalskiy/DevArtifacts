import sys
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:       
        for line in data:
            output.append(line.strip().split(';'))
    return get_intersections(output) 
    

def get_intersections(input_list):
    output = []
    for i in input_list:
        a = set(i[0].split(','))
        b = set(i[1].split(','))
        res = a.intersection(b)
        if res:
            res = sorted(map(int, list(res)))            
            output.append(",".join(str(i) for i in res))
    return output

def print_lines(input_list):
    for line in input_list:
        print line

if __name__ == "__main__":    
    try:
       print_lines(main(sys.argv[1]))
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)