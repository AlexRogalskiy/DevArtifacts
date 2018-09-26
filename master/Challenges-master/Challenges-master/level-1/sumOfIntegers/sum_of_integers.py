import sys
 
def main(input_file):
    return sum(get_data_from_file(input_file))    


def get_data_from_file(input_file):
    output = []   
    with open(input_file, 'r') as data:       
        for line in data:
            output.append(int(line.strip()))
    return output


if __name__ == "__main__":    
    try:
       print main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)