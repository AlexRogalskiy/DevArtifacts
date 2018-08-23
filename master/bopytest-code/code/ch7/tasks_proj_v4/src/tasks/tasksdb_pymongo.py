import os
from pprint import pprint
import pymongo
import shutil
import subprocess
import tempfile
import time

class TasksDB_mongodb():

    def __init__(self, db_path):
        self._process = None
        self._client = None
        self._start_mongod(db_path)
        self._connect()

    def add(self, task):
        task['_id'] = self._get_next_task_id()
        return self._db.task_list.insert_one(task).inserted_id

    def get(self, task_id): 
        task_dict = self._db.task_list.find_one({'_id':task_id})
        task_dict['id'] = task_dict.pop('_id')
        return task_dict

    def list(self, owner=None):
        if owner is None:
            all = self._db.task_list.find()
        else:
            all = self._db.task_list.find({'owner':owner})
        for task_dict in all:
            task_dict['id'] = task_dict.pop('_id')
        return all


    def count(self):
        return self._db.task_list.count()

    def update(self, task_id, task): 
        self._db.tasks_list.update_one({'_id':task_id}, task)

    def delete(self, task_id): 
        reply = self._db.task_list.delete_one({'_id': task_id})
        if reply.deleted_count == 0:
            raise ValueError('id {} not in task database'.format(str(task_id)))

    def unique_id(self):
        tail_task_ids = self._db.counters.find_one({ '_id': 'tasksid'})
        uid = tail_task_ids['seq'] + 1
        return uid

    def delete_all(self):
        self._db.task_list.drop()

    def stop_tasks_db(self):
        self._disconnect()
        self._stop_mongod()

    def _start_mongod(self, db_path):
        self._devnull = open(os.devnull, 'wb')
        self._process = subprocess.Popen(['mongod', '--dbpath', db_path ],
                                         stdout=self._devnull,
                                         stderr=subprocess.STDOUT)
        assert self._process, "mongod process failed to start"

    def _stop_mongod(self):
        if self._client:
            self._client = None
        if self._process:
            self._process.terminate()
            #self._process.kill()
            self._process.wait()
            self._devnull.close()
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
                self._db = self._client.task_db
                self._db.counters.insert_one({'_id': 'tasksid', 'seq':0})

    def _reset_task_id(self):
        self._db.counters.find_one_and_update({'_id': 'tasksid'}, 
                                              {'$set': {'seq':0}})

    def _get_next_task_id(self):
        ret = self._db.counters.find_one_and_update({ '_id': 'tasksid'},
                                                    { '$inc': {'seq': 1} })
        return ret['seq']

    def _disconnect(self):
        self._db = None

def start_tasks_db(db_path):
    return TasksDB_mongodb(db_path)

