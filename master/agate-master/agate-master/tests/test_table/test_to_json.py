#!/usr/bin/env python
# -*- coding: utf8 -*-

import os
import sys
import six
import json

from agate import Table
from agate.testcase import AgateTestCase
from agate.data_types import *


class TestJSON(AgateTestCase):
    def setUp(self):
        self.rows = (
            (1, 'a', True, '11/4/2015', '11/4/2015 12:22 PM', '4:15'),
            (2, u'👍', False, '11/5/2015', '11/4/2015 12:45 PM', '6:18'),
            (None, 'b', None, None, None, None)
        )

        self.column_names = [
            'number', 'text', 'boolean', 'date', 'datetime', 'timedelta'
        ]

        self.column_types = [
            Number(), Text(), Boolean(), Date(), DateTime(), TimeDelta()
        ]

    def test_to_json(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.to_json(output, indent=4)

        js1 = json.loads(output.getvalue())

        with open('examples/test.json') as f:
            js2 = json.load(f)

        self.assertEqual(js1, js2)

    def test_to_json_key(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.to_json(output, key='text', indent=4)

        js1 = json.loads(output.getvalue())

        with open('examples/test_keyed.json') as f:
            js2 = json.load(f)

        self.assertEqual(js1, js2)

    def test_to_json_key_func(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.to_json(output, key=lambda r: r['text'], indent=4)

        js1 = json.loads(output.getvalue())

        with open('examples/test_keyed.json') as f:
            js2 = json.load(f)

        self.assertEqual(js1, js2)

    def test_to_json_newline_delimited(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.to_json(output, newline=True)

        js1 = json.loads(output.getvalue().split('\n')[0])

        with open('examples/test_newline.json') as f:
            js2 = json.loads(list(f)[0])

        self.assertEqual(js1, js2)

    def test_to_json_error_newline_indent(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()

        with self.assertRaises(ValueError):
            table.to_json(output, newline=True, indent=4)

    def test_to_json_error_newline_key(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()

        with self.assertRaises(ValueError):
            table.to_json(output, key='three', newline=True)

    def test_to_json_file_output(self):
        table = Table(self.rows, self.column_names, self.column_types)

        table.to_json('.test.json')

        with open('.test.json') as f1:
            js1 = json.load(f1)

        with open('examples/test.json') as f2:
            js2 = json.load(f2)

        self.assertEqual(js1, js2)

        os.remove('.test.json')

    def test_to_json_make_dir(self):
        table = Table(self.rows, self.column_names, self.column_types)

        table.to_json('newdir/test.json')

        with open('newdir/test.json') as f1:
            js1 = json.load(f1)

        with open('examples/test.json') as f2:
            js2 = json.load(f2)

        self.assertEqual(js1, js2)

        os.remove('newdir/test.json')
        os.rmdir('newdir/')

    def test_print_json(self):
        table = Table(self.rows, self.column_names, self.column_types)

        old = sys.stdout
        sys.stdout = six.StringIO()

        try:
            table.print_json()

            js1 = json.loads(sys.stdout.getvalue())

            with open('examples/test.json') as f:
                js2 = json.load(f)

            self.assertEqual(js1, js2)
        finally:
            sys.stdout = old
