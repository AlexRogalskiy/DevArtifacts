import pytest
import json

@pytest.fixture(scope='module') 
def author_file_json(tmpdir_factory):
    python_author_data = {
        'Ned' : { 'City': 'Boston' },
        'Brian' : { 'City': 'Portland' },
        'Luciano' : { 'City': 'Sau Paulo' } 
    }

    file = tmpdir_factory.mktemp('data').join('author_file.json')
    print('file:{}'.format(str(file)))

    with file.open('w') as f:
        json.dump(python_author_data, f) 
    return file



