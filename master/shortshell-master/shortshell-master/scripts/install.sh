#!/bin/bash

echo "Installing ShortShell..."

export SHORTSHELL=`pwd`

if [ ! -f $SHORTSHELL/dir_colors ]; then
	echo
	echo "Could not find files to symlink."
	echo "Did you not run make install?"
	exit 1
fi

echo
echo "Creating symlinks"

ln -sih $SHORTSHELL/dir_colors ~/.dir_colors
ln -sih $SHORTSHELL/vimrc ~/.vimrc
ln -sih $SHORTSHELL/vim ~/.vim

if [ -f ~/.bashrc ]; then
	FILETARGET=~/.bashrc
elif [ -f ~/.bash_profile ]; then
	FILETARGET=~/.bash_profile
else
	FILETARGET=""
	echo "Could not find ~/.bashrc or ~/.bash_profile"
	exit 1
fi


if [ -n $FILETARGET ]; then
	echo
	echo "Appending lines to $FILETARGET"
	
	cat >> $FILETARGET << EOF


##
## shortshell
##

# Set the path to your install of shortshell
export SHORTPATH=$SHORTSHELL

if [ -f \$SHORTPATH/bashrc ]; then
    # Set web root paths for hop
    # Put user-agnostic path first if one exists
    # Separate additional roots with a pipe
    export SHORTWEBROOTS="/var/www/html/|/home/\$USER/html/"

    # Set your prompt color (ANSI)
    PCLR='32'

    # Source the shortshell bashrc
    . \$SHORTPATH/bashrc
fi
EOF
	
	echo
	echo "To finish, run: source $FILETARGET"
	echo
fi