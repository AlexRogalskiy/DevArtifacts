import sys
import math
import ast
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:
        for line in data:                              
            print get_distance(line.strip())    
    

def get_distance(coordinates):
    coordinates = list(ast.literal_eval(coordinates.replace(')', '),')))    
    expression = (coordinates[1][0] - coordinates[0][0])**2 + (coordinates[1][1] - coordinates[0][1])**2    
    distance = int(math.sqrt(expression))
    return distance


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)