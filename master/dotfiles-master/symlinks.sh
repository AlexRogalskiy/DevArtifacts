#!/bin/zsh

DIR=$( cd $(dirname $0) ; pwd )

FILES=(
  # Terminal
  ".terminfo/78/xterm-256color"
  ".terminfo/78/xterm-256color.terminfo"
  ".oh-my-zsh/themes/dbushell.zsh-theme"
  ".bash_profile"
  ".hyper.js"
  ".zshrc"
  #Vim
  ".vim/ftplugin/markdown.vim"
  ".vim/colors/dbushell.vim"
  ".vimrc"
  #Git
  ".gitconfig"
  ".gitignore"
)

RESET=$(printf " \e[m")
PINK=$(printf " \e[35m")
YELLOW=$(printf " \e[33m")

for FILE in "${FILES[@]}"
do
  echo -e "${YELLOW}$DIR/$FILE${RESET} ← ${PINK}~/$FILE"
  # if [ ! -f ~/$FILE ]; then
    ln -sfn $DIR/$FILE ~/$FILE
  # fi
done
