import pytest
import time 

@pytest.fixture(autouse=True, scope='session')
def footer_session_scope():
    'report the time at the end of a session'
    yield 
    now = time.time()
    print('--')
    print('finished : {}'.format(time.strftime('%c', time.localtime(now))))
    print('-----------------')

@pytest.fixture(autouse=True)
def footer_function_scope():
    'report test durations after each function'
    start = time.time()
    yield 
    stop = time.time()
    delta = stop - start
    print('\ntest duration : {:0.3} seconds'.format(delta))


def test_1():
    time.sleep(1)

def test_2():
    time.sleep(1.23)
