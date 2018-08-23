import pytest
import tasks
from tasks import Task

tasks_to_try = (Task('sleep', done=True),
                Task('wake', 'brian'),
                Task('breathe', 'BRIAN', True),
                Task('exercise', 'BrIaN', False))

task_ids = ['Task({},{},{})'.format(t.summary, t.owner, t.done)
            for t in tasks_to_try]

def equivalent(t1, t2):
    # someTask[:-1] -> a tuple containing (summary, owner, done)
    # i.e. compare everything but the id field
    return t1[:-1] == t2[:-1]

@pytest.fixture(params=tasks_to_try)
def a_task(request):
    'using no ids'
    return request.param

def test_add_a(tasks_db, a_task):
    task_id = tasks.add(a_task)
    t_from_db = tasks.get(task_id)
    assert equivalent(t_from_db, a_task)

@pytest.fixture(params=tasks_to_try, ids=task_ids)
def b_task(request):
    'using list of ids'
    return request.param

def test_add_b(tasks_db, b_task):
    task_id = tasks.add(b_task)
    t_from_db = tasks.get(task_id)
    assert equivalent(t_from_db, b_task)

def id_func(fixture_value):
    t = fixture_value
    return 'Task({},{},{})'.format(t.summary, t.owner, t.done)

@pytest.fixture(params=tasks_to_try, ids=id_func)
def c_task(request):
    'using id_func'
    return request.param

def test_add_c(tasks_db, c_task):
    task_id = tasks.add(c_task)
    t_from_db = tasks.get(task_id)
    assert equivalent(t_from_db, c_task)


