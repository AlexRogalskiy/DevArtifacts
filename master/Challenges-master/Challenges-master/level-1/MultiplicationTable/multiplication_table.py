import sys

def main(dimension):
    for i in xrange(1, dimension + 1):        
        row = []
        for j in xrange(1, dimension + 1):
            # format width for 4 spaces
            row.append("{:>4}".format(str(i * j)))            
        print "".join(row)

if __name__ == "__main__":
    main(12)