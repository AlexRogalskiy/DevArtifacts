import sys
 
def main(input_file):   
    with open(input_file, 'r') as data:
        for line in data:
            print line.lower()
 

if __name__ == "__main__":
    # first argument must be a text file
    try:
        main(sys.argv[1])
    except Exception:
        print sys.argv[1]
        print 'First argument must be a text file!'