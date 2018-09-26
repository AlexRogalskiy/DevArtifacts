import sys
 
def main(input_file):   
    with open(input_file, 'r') as data:
        for line in data:
            print remove_duplicates(line.strip().split(','))


def remove_duplicates(input_list):
    uniques = []
    for element in input_list:
        if element not in uniques:
            uniques.append(element)
    return ",".join(uniques)


if __name__ == "__main__":
    # first argument must be a text file
    try:
        main(sys.argv[1])
    except Exception:        
        print 'First argument must be a text file!'