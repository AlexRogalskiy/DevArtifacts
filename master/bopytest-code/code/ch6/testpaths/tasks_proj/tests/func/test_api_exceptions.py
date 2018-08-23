import pytest
import tasks

def test_add_TypeError(tasks_db):
    with pytest.raises(TypeError):
        tasks.add(task='not a Task object')

@pytest.mark.somke
def test_list_TypeError(tasks_db):
    with pytest.raises(TypeError):
        tasks.list(owner=123)

@pytest.mark.get
@pytest.mark.smoke
def test_get_TypeError(tasks_db):
    with pytest.raises(TypeError):
        tasks.get(task_id='123')

class TestUpdate():
    
    def test_bad_id(self, tasks_db):
        with pytest.raises(TypeError):
            tasks.update(task_id={'dict instead':1}, 
                         task=tasks.Task()) 

    def test_bad_task(self, tasks_db):
        with pytest.raises(TypeError):
            tasks.update(task_id=1, task='not a task')

def test_delete_TypeError(tasks_db):
    with pytest.raises(TypeError):
        tasks.delete(task_id=(1,2,3))

def test_start_tasks_db_ValueError(tasks_db):
    with pytest.raises(ValueError) as excinfo:
        tasks.start_tasks_db('some/great/path', 'mysql')
    exception_msg = excinfo.value.args[0]
    assert exception_msg == "db_type must be a 'tiny' or 'mongo'"


