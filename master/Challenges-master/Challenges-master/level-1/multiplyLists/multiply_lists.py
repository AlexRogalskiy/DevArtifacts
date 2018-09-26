import sys
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:
        for line in data:                              
            print multiply_lists(line)    
    

def multiply_lists(lists):
    lists = lists.split('|')
    first_list = map(int, lists[0].split())
    second_list = map(int, lists[1].split())     
    return " ".join([ str(e * second_list[i]) for i, e in enumerate(first_list) ])


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)