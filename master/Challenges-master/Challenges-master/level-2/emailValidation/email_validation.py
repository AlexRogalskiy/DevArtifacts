import sys, re
 
def main(input_file):    
    with open(input_file, 'r') as data:       
        for line in data:
            print email_validation(line.strip())



def email_validation(email):
    EMAIL_REGEX = re.compile(r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$") #
    return 'true' if EMAIL_REGEX.match(email) else 'false'


if __name__ == "__main__":    
    try:
        main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)