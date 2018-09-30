#!/usr/bin/env python
# -*- coding: utf8 -*-

import six

from agate import Table
from agate.data_types import *
from agate.testcase import AgateTestCase
from agate.exceptions import DataTypeError


class TestPrintBars(AgateTestCase):
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

    def test_print_bars(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.print_bars('three', 'one', output=output)
        lines = output.getvalue().split('\n')  # noqa

    def test_print_bars_width(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.print_bars('three', 'one', width=40, output=output)
        lines = output.getvalue().split('\n')

        self.assertEqual(max([len(l) for l in lines]), 40)

    def test_print_bars_width_overlap(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.print_bars('three', 'one', width=20, output=output)
        lines = output.getvalue().split('\n')

        self.assertEqual(max([len(l) for l in lines]), 20)

    def test_print_bars_domain(self):
        table = Table(self.rows, self.column_names, self.column_types)

        table.print_bars('three', 'one', domain=(0, 300))

    def test_print_bars_domain_invalid(self):
        table = Table(self.rows, self.column_names, self.column_types)

        with self.assertRaises(ValueError):
            table.print_bars('three', 'one', domain=(5, 0))

    def test_print_bars_negative(self):
        rows = (
            ('-1.7', 2, 'a'),
            ('-11.18', None, None),
            ('0', 1, 'c')
        )

        table = Table(rows, self.column_names, self.column_types)
        table.print_bars('three', 'one')

    def test_print_bars_mixed_signs(self):
        rows = (
            ('-1.7', 2, 'a'),
            ('11.18', None, None),
            ('0', 1, 'c')
        )

        table = Table(rows, self.column_names, self.column_types)
        table.print_bars('three', 'one')

    def test_print_bars_invalid_values(self):
        table = Table(self.rows, self.column_names, self.column_types)

        with self.assertRaises(DataTypeError):
            table.print_bars('one', 'three')

    def test_print_bars_with_nulls(self):
        table = Table(self.rows, self.column_names, self.column_types)

        output = six.StringIO()
        table.print_bars('three', 'two', width=20, printable=True,
                         output=output)

        self.assertEqual(output.getvalue(), "three   two\n"
                                            "a     2,000 |:::::::\n"
                                            "None      - |       \n"
                                            "c         1 |       \n"
                                            "            +------+\n"
                                            "            0  2,000\n")
