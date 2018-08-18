#!/bin/sh


# Install Homebrew on OS X
if [[ $(uname) == 'Darwin' ]]; then

  read -p "Would you like to set up OS X preferences? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./osx.sh
  fi

  read -p "Would you like to install brew packages? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./brew.sh
  fi

  read -p "Would you like to install npm packages? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./npm.sh
  fi


fi
