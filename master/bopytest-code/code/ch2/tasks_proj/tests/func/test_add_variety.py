import pytest
import tasks
from tasks import Task

def test_add_1():
    task = Task('breathe', 'BRIAN', True)
    task_id = tasks.add(task)
    t_from_db = tasks.get(task_id)
    # everything but the id should be the same
    assert equivalent(t_from_db, task)

def equivalent(t1, t2):
    # someTask[:-1] -> a tuple containing (summary, owner, done)
    # i.e. compare everything but the id field
    return t1[:-1] == t2[:-1]

@pytest.fixture(autouse=True)
def initialized_tasks_db(tmpdir):
    tasks.start_tasks_db(str(tmpdir), 'tiny')
    yield 
    tasks.stop_tasks_db()

@pytest.mark.parametrize('task', 
    [Task('sleep', done=True),
     Task('wake', 'brian'),
     Task('breathe', 'BRIAN', True),
     Task('exercise', 'BrIaN', False)])
def test_add_2(task):
    task_id = tasks.add(task)
    t_from_db = tasks.get(task_id)
    assert equivalent(t_from_db, task)

@pytest.mark.parametrize('summary, owner, done',
    [('sleep'   , None    , False ),
     ('wake'    , 'brian' , False ),
     ('breathe' , 'BRIAN' , True ),
     ('eat eggs', 'BrIaN' , False),
    ])
def test_add_3(summary, owner, done):
    task = Task(summary, owner, done)
    task_id = tasks.add(task)
    t_from_db = tasks.get(task_id)
    assert equivalent(t_from_db, task)


tasks_to_try = (Task('sleep', done=True),
                Task('wake', 'brian'),
                Task('breathe', 'BRIAN', True),
                Task('exercise', 'BrIaN', False))

@pytest.mark.parametrize('task', tasks_to_try)
def test_add_4(task):
    task_id = tasks.add(task)
    t_from_db = tasks.get(task_id)
    assert equivalent(t_from_db, task)

task_ids = ['Task({},{},{})'.format(t.summary, t.owner, t.done)
            for t in tasks_to_try]

@pytest.mark.parametrize('task', tasks_to_try, ids=task_ids)
def test_add_5(task):
    task_id = tasks.add(task)
    t_from_db = tasks.get(task_id)
    assert equivalent(t_from_db, task)

@pytest.mark.parametrize('task', tasks_to_try, ids=task_ids)
class TestAdd():
    def test_equivilent(self, task):
        task_id = tasks.add(task)
        t_from_db = tasks.get(task_id)
        assert equivalent(t_from_db, task)

    def test_valid_id(self, task):
        task_id = tasks.add(task)
        t_from_db = tasks.get(task_id)
        assert t_from_db.id == task_id


