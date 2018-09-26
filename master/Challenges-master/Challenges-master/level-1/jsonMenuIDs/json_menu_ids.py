import sys, json 
 
def main(input_file):
    with open(input_file, 'r') as data:
        for line in data:            
            print sum_of_ids(line.strip())


def sum_of_ids(json_string):
	data, ids = json.loads(json_string), []
	for item in data['menu']['items']:		
		if item is not None and 'label' in item:
			ids.append(item['id'])
	return sum(ids)

if __name__ == "__main__":    
    try:
       main(sys.argv[1])
    except Exception as e:        
        print 'First argument must be a text file!\nError: {0}'.format(e)