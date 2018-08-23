import pytest
import tasks 
from tasks import Task


@pytest.fixture(scope='session')
def tasks_db_session(tmpdir_factory, request):
    temp_dir = tmpdir_factory.mktemp('temp')
    tasks.start_tasks_db(str(temp_dir), 'tiny')
    yield # this is where the testing happens
    tasks.stop_tasks_db()


@pytest.fixture(scope='session')
def tasks_just_a_few():
    'All summaries and owners are unique.'
    return (
        Task('Write a chapter', 'Brian', True), 
        Task("Code review Brian's code", 'Katie', False), 
        Task('Fix what Brian did', 'Anna', False), 
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




