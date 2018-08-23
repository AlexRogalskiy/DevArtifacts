import pytest

def setup_module(): 
    print('\nsetup_module() - xUnit')

def teardown_module(): 
    print('teardown_module() - xUnit')

def setup_function(): 
    print(f'setup_function() - xUnit')

def teardown_function(): 
    print(f'teardown_function() - xUnit\n')

@pytest.fixture(scope='module')
def module_fixture():
    print(f'module_fixture() setup - pytest')
    yield
    print(f'module_fixture() teardown - pytest')

@pytest.fixture(scope='function')
def function_fixture():
    print(f'function_fixture() setup - pytest')
    yield
    print(f'function_fixture() teardown - pytest')

def test_1(module_fixture, function_fixture):
    print('test_1()') 

def test_2(module_fixture, function_fixture):
    print('test_2()')
