#!/usr/bin/python -tt

## Script to remove marking of named entities that are inside other named entity
## input: STDIN

from sys import stdin

for line in stdin:
  new_string = ""
  last_special = ">"
  inside = 0
  tag = False
  
  for ch in line:
    if tag and ch in [" ", "<"]:
      tag = False

    if not tag:
      if ch == "<" and inside == 0:
        new_string += "<"
        last_special = "<"
        inside += 1
        tag = True
      elif ch == "<" and inside > 0:
        inside += 1
        tag = True
      elif ch == ">" and inside > 1:
        last_special = ">"
        inside -= 1
      else:
        new_string += ch
        if ch == ">":
          inside -= 1

  print " ".join(new_string.split()).replace("< ","<")
