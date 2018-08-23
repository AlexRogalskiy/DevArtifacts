import pytest
import tasks 

# @pytest.fixture(scope='session', params=['tiny', 'mongo'])
# def tasks_db_session(tmpdir_factory, request):

@pytest.fixture(scope='session')
def tasks_db_session(tmpdir_factory):
    # Setup : start db
    temp_dir = tmpdir_factory.mktemp('temp')
    tasks.start_tasks_db(str(temp_dir), 'tiny')

    yield # this is where the testing happens

    # Teardown : stop db
    tasks.stop_tasks_db()

from tasks import Task

# Reminder of Task constructor interface
# Task(summary=None, owner=None, done=False, id=None) 
# Don't set id, it's set by database
# owner and done are optional

@pytest.fixture(scope='session')
def tasks_just_a_few():
    'All summaries and owners are unique.'
    return (
        Task('Write some code', 'Brian', True), 
        Task("Code review Brian's code", 'Katie', False), 
        Task('Fix what Brian did', 'Anna', False), 
        )

@pytest.fixture(scope='session')
def tasks_mult_per_owner():
    'Several owners with several tasks each.'
    return (
        Task('Make a cookie', 'Raphael'), 
        Task('Use an emoji', 'Raphael'), 
        Task('Move to Berlin', 'Raphael'), 

        Task('Teach people', 'Carrie'), 
        Task('Make some videos', 'Carrie'), 
        Task('Inspire', 'Carrie'), 

        Task('Do a handstand', 'Daniel'), 
        Task('Write some books', 'Daniel'), 
        Task('Eat ice cream', 'Daniel'), 
        )

@pytest.fixture()
def tasks_db(tasks_db_session):
    'an empty tasks db'
    tasks.delete_all()

@pytest.fixture()
def db_with_3_tasks(tasks_db, tasks_just_a_few):
    'tasks db with 3 tasks, all unique'
    for t in tasks_just_a_few:
        tasks.add(t)

@pytest.fixture()
def db_with_multi_per_owner(tasks_db, tasks_mult_per_owner):
    'tasks db 3 owners, all with 3 tasks'
    for t in tasks_mult_per_owner:
        tasks.add(t)


