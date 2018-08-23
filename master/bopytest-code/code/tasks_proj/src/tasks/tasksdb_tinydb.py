import tinydb

class TasksDB_tinydb():

    def __init__(self, db_path):
        self._db = tinydb.TinyDB(db_path + '/tasks_db.json')

    def add(self, task):
        task_id = self._db.insert(task)
        task['id'] = task_id
        self._db.update(task, eids=[task_id])
        return task_id

    def get(self, task_id):
        return self._db.get(eid=task_id)

    def list(self, owner):
        if owner is None:
            return self._db.all()
        else:
            return self._db.search(tinydb.Query().owner == owner)

    def count(self):
        return len(self._db)

    def update(self, task_id, task):
        self._db.update(task, eids=[task_id])

    def delete(self, task_id):
        self._db.remove(eids=[task_id])

    def delete_all(self):
        self._db.purge()

    def unique_id(self):
        # pick a number that isn't a valid eid
        i = 1
        while self._db.contains(eids=[i]):
            i += 1
        return i

    def stop_tasks_db(self):
        '''Any teardown necessary.'''
        pass

def start_tasks_db(db_path):
    '''.'''
    return TasksDB_tinydb(db_path)
