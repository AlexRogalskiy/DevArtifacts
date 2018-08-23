import tasks
from tasks import Task

# def test_list_by_owner(db_with_multi_per_owner):
#     all_tasks = tasks.list()
#     all_owners = [t.owner for t in all_tasks]
#     assert len(all_owners) < len(all_tasks)
#     for owner in all_owners:
#         owners_tasks = tasks.list(owner=owner)
#         for t in owners_tasks:
#             assert t.owner == owner
# 
# 
# def test_list_by_owner_2(db_with_multi_per_owner):
#     all_tasks = tasks.list()
#     all_owners = set([t.owner for t in all_tasks])
#     assert len(all_owners) < len(all_tasks)
#     for owner in all_owners:
#         owners_tasks = tasks.l(owner=owner)
#         assert len(owners_tasks) < len(all_tasks)
#         for t in owners_tasks:
#             assert t.owner == owner

def test_update_owner(tasks_db):
    orig_summary = 'fly to Munich'
    task_id = tasks.add(Task(orig_summary))
    new_owner = 'okken'
    tasks.update(task_id, Task(owner=new_owner))
    assert tasks.get(task_id).owner == new_owner
    assert tasks.get(task_id).summary == orig_summary

def test_update_done_true(tasks_db):
    orig_summary = 'take 3 trains'
    task_id = tasks.add(Task(orig_summary))
    tasks.update(task_id, Task(done=True))
    assert tasks.get(task_id).done  
    assert tasks.get(task_id).summary == orig_summary

def test_update_done_false(tasks_db):
    orig_summary = 'walk up hill'
    task_id = tasks.add(Task(orig_summary))
    tasks.update(task_id, Task(done=False))
    assert not tasks.get(task_id).done





