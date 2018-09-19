# Load required modules
import os
import sys

# Add the parent directory to the path so the modules in here can be used
cwd = os.getcwd()
basedir = os.path.dirname(cwd)
sys.path.append(cwd)
sys.path.append(basedir)

# Load relative modules
from config import *
from textmining.extract import *
from legalintelligence.tools import *