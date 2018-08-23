import pytest
import tasks

def test_unique_id(tasks_mult_per_owner):
    existing_tasks = tasks.list()
    uid = tasks.unique_id()
    for t in existing_tasks:
        assert uid != t.id

