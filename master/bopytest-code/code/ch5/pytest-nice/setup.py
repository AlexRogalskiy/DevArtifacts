from setuptools import setup

setup(
    name='pytest-nice',
    version='0.1.0',
    description='A pytest plugin to turn FAILURE into OPPORTUNITY',
    url='https://wherever/you/have/info/on/this/package',
    author='Your Name',
    author_email='your_email@somewhere.com',
    license='MIT',
    py_modules=['pytest_nice'],
    entry_points={'pytest11': ['nice = pytest_nice', ], },
)
