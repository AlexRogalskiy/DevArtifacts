#!/usr/bin/env python
# -*- coding: utf8 -*-

import six

from agate import Table
from agate.data_types import *
from agate.testcase import AgateTestCase


class TestPrintTable(AgateTestCase):
    def setUp(self):
        self.rows = (
            ('1.7', 2000, 'a'),
            ('11.18', None, None),
            ('0', 1, 'c')
        )

        self.number_type = Number()
        self.international_number_type = Number(locale='de_DE')
        self.text_type = Text()

        self.column_names = ['one', 'two', 'three']
        self.column_types = [
            self.number_type,
            self.international_number_type,
            self.text_type
        ]

    def test_print_table(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.print_table(output=output)
        lines = output.getvalue().split('\n')

        self.assertEqual(len(lines), 6)
        self.assertEqual(len(lines[0]), 25)

    def test_print_table_max_rows(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.print_table(max_rows=2, output=output)
        lines = output.getvalue().split('\n')

        self.assertEqual(len(lines), 6)
        self.assertEqual(len(lines[0]), 25)

    def test_print_table_max_columns(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.print_table(max_columns=2, output=output)
        lines = output.getvalue().split('\n')

        self.assertEqual(len(lines), 6)
        self.assertEqual(len(lines[0]), 23)

    def test_print_table_max_precision(self):
        rows = (
            ('1.745', 1.745, 1.72),
            ('11.123456', 11.123456, 5.10),
            ('0', 0, 0.10)
        )

        column_names = ['text_number', 'real_long_number', 'real_short_number']
        column_types = [
            self.text_type,
            self.number_type,
            self.number_type
        ]
        table = Table(rows, column_names, column_types)

        output = six.StringIO()
        table.print_table(output=output, max_precision=2)
        lines = output.getvalue().split('\n')

        # Text shouldn't be affected
        self.assertIn(u' 1.745 ', lines[2])
        self.assertIn(u' 11.123456 ', lines[3])
        self.assertIn(u' 0 ', lines[4])
        # Test real precision above max
        self.assertIn(u' 1.74… ', lines[2])
        self.assertIn(u' 11.12… ', lines[3])
        self.assertIn(u' 0.00… ', lines[4])
        # Test real precision below max
        self.assertIn(u' 1.72 ', lines[2])
        self.assertIn(u' 5.10 ', lines[3])
        self.assertIn(u' 0.10 ', lines[4])

    def test_print_table_max_column_width(self):
        rows = (
            ('1.7', 2, 'this is long'),
            ('11.18', None, None),
            ('0', 1, 'nope')
        )

        column_names = ['one', 'two', 'also, this is long']
        table = Table(rows, column_names, self.column_types)

        output = six.StringIO()
        table.print_table(output=output, max_column_width=7)
        lines = output.getvalue().split('\n')

        self.assertIn(' also... ', lines[0])
        self.assertIn(' this... ', lines[2])
        self.assertIn(' nope ', lines[4])

    def test_print_table_locale(self):
        """
        Verify that the locale of the international number is correctly
        controlling the format of how it is printed.
        """
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.print_table(max_columns=2, output=output, locale='de_DE')
        # If it's working, the english '2,000' should appear as '2.000'
        self.assertTrue("2.000" in output.getvalue())
