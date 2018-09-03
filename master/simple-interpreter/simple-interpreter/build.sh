#!/usr/bin/env bash

./cleanup.sh

alex Lex.x
happy Synt.y
ghc LexMain.hs
ghc SyntMain.hs
ghc InterpretMain.hs
