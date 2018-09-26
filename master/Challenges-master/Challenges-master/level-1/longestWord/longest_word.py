import sys
 
def main(input_file):
    output = []
    with open(input_file, 'r') as data:
        for line in data:                              
            print line    
    

def longest_word(string):
    pass


# if __name__ == "__main__":    
#     try:
#        main(sys.argv[1])
#     except Exception as e:        
#         print 'First argument must be a text file!\nError: {0}'.format(e)

string = 'some line with333 text2'
str_list = string.split()
print sorted(str_list, key=max, reverse=True)