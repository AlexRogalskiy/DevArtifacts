import sys
 
def main(start, end):
    return get_odd_numbers(start, end)


def get_odd_numbers(start, end):
    output = []
    for i in xrange(start, end):
        if i % 2 != 0:
            output.append(i)
    return output

def print_odd_numbers(odd_list):
    for i in odd_list:
        print i


if __name__ == "__main__":    
    try:
       print_odd_numbers(main(1, 100))
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)