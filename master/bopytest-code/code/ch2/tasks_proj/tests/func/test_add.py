import pytest
import tasks
from tasks import Task

def test_add_returns_valid_id():
    # GIVEN an initialized tasks db
    # WHEN a new task is added
    new_task = Task('do something')
    task_id = tasks.add(new_task)
    # THEN returned task_id is of type int
    assert isinstance(task_id, int)

@pytest.mark.smoke
def test_added_task_has_id_set():
    # GIVEN an initialized tasks db
    #   AND a new task is added
    new_task = Task('sit in chair', owner='me', done=True)
    task_id = tasks.add(new_task)
    # WHEN task is retrieved
    task_from_db = tasks.get(task_id)
    # THEN task_id matches id field
    assert task_from_db.id == task_id
    # AND contents are equivalent (except for id)
    # the [:-1] syntax returns a list with all but the last element
    assert task_from_db[:-1] == new_task[:-1]

@pytest.fixture(autouse=True)
def initialized_tasks_db(tmpdir):
    # Setup : start db
    tasks.start_tasks_db(str(tmpdir), 'tiny')

    yield # this is where the testing happens

    # Teardown : stop db
    tasks.stop_tasks_db()



