#!/bin/sh
# Provide TextMate-like math eval support to Sublime Text 2
# { "keys": ["super+shift+m"], "command": "filter_through_command", "args": { "cmdline": "~/shortshell/bin/st_math.sh" } }
foo=$(cat /dev/stdin)
bar=$(echo "scale=4; $foo" | bc)
/bin/echo -n $bar
