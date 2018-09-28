# python startup file to toggle autocomplete on.
# e.g. export PYTHONSTARTUPFILE=pythonstartup.py
#

import readline
import rlcompleter
readline.parse_and_bind('tab: complete')
print "Auto complete is enabled"
