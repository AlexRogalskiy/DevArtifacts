import sys
import os 
 
def main(input_file):
    print os.path.getsize(input_file)


if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)