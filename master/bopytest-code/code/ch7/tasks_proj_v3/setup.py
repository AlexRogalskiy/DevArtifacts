# -*- coding: utf-8 -*-
from setuptools import setup, find_packages


setup(
    name='tasks',
    version='0.3.0',
    license='MIT',
    description='Minimal Project Task Management',

    author='Brian Okken',
    author_email='Please use pythontesting.net contact form.',
    url='https://pragprog.com/book/bopytest',

    packages=find_packages(where='src'),
    package_dir={'': 'src'},

    install_requires=['click', 'tinydb', 'six', 
                      'pytest', 'pytest-cov', 'pytest-mock'],

    extras_require={'mongo': 'pymongo'},

    entry_points={
        'console_scripts': [
            'tasks = tasks.cli:main',
        ]
    },

)
