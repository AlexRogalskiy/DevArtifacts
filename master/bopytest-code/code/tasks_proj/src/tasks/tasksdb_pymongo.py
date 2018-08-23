import os
from pprint import pprint
import pymongo
import shutil
import subprocess
import tempfile
import time
from bson.objectid import ObjectId

class TasksDB_mongodb():

    def __init__(self, db_path):
        self._process = None
        self._client = None
        self._start_mongod(db_path)
        self._connect()

    def add(self, task):
        return self._db.task_list.insert_one(task).inserted_id

    def get(self, task_id): 
        return self._db.task_list.find_one({'_id':ObjectId(task_id)})

    def list(self):
        return list(self._db.task_list.find())

    def count(self):
        return self._db.task_list.count()

    def update(self, task_id, task): 
        self._db.tasks_list.update_one({'_id':ObjectId(task_id)}, task)

    def delete(self, task_id): 
        reply = self._db.task_list.delete_one({'_id': ObjectId(task_id)})
        if reply.deleted_count == 0:
            raise ValueError('id {} not in task database'.format(str(task_id)))

    def unique_id(self):
        return ObjectId()

    def delete_all(self):
        self._db.task_list.drop()

    def stop_tasks_db(self):
        self._disconnect()
        self._stop_mongod()

    def _start_mongod(self, db_path):
        self._process = subprocess.Popen(['mongod', '--dbpath', db_path ],
                                             stdout=open(os.devnull, 'wb'),
                                             stderr=subprocess.STDOUT)
        assert self._process, "mongod process failed to start"

    def _stop_mongod(self):
        if self._process:
            self._process.terminate()
            self._process.wait()
            self._process = None

    def _connect(self):
        if self._process and (not self._client or not self._db):
            for i in range(3):
                try:
                    self._client = pymongo.MongoClient()
                except pymongo.errors.ConnectionFailure:
                    time.sleep(0.1)
                    continue
                else:
                    break
            if self._client:
                self._db = self._client.task_list

    def _disconnect(self):
        self._db = None
        self._client = None

def start_tasks_db(db_path):
    return TasksDB_mongodb(db_path)

