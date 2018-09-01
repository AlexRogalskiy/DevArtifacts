######
### shortshell bashrc
###



## Default web root path
## Used by the custom shortshell bash prompt and shorthsell/bin/hop.sh
if [ -z $SHORTWEBROOTS ]; then
    export SHORTWEBROOTS='/home/$USER/webdocs/'
fi



##
## Set the custom shortshell bash prompt is in the format:
## <colormark>[<first letter of user>@<hostname> <shortened path>]$
##
## The shortened path is either the full path, or when you are in a folder
## in one of the $SHORTWEBROOTS paths then the path is shortened to just be
## the <site>+<current subfolder>
##

# OSTYPE definitions
DARWIN='darwin'
LINUX='linux-gnu'

# Note: Could check if $TERM is xterm-color before
# setting colormark and cdiff...

# OS specific sed flag
if [ -n "$(echo $OSTYPE | grep $DARWIN)" ]; then
    SEDFLAG='-E'
elif [ $OSTYPE == $LINUX ]; then
    SEDFLAG='-r'
else
    echo "shortshell bashrc unknown OSTYPE: $OSTYPE"
fi


# Actually set the bash prompt
# Uses environment variable $PCLR to set the color.
export PS1="\[\033[1;${PCLR:-32}m\]*\[\033[0m\][\$(echo $USER | sed $SEDFLAG \"s~(.).*$~\1~g\")@\h \$(echo \$(pwd | sed $SEDFLAG \"s~($SHORTWEBROOTS)([^/]*)([^/]*/)*~\2\+~g\" | sed $SEDFLAG \"s%$HOME%~%g\" | sed -E \"s%(/[^/]+)+((/[^/]+){3}$)%...\2%g\"))]$ "



##
## Define color-highlighted ls with helpful flags
##

# OS dependent flags
if [ -n "$(echo $OSTYPE | grep $DARWIN)" ]; then
    LSFLAG='-G'
    export LSCOLORS='HxcxcxcxcxcxcxcxcxHxHx'
elif [ $OSTYPE == $LINUX ]; then
    LSFLAG='--color=auto'
    if [ -z $LS_COLORS ]; then
        export LS_COLORS='no=00:fi=04:di=01;37:ln=04;32:pi=40;32:so=00;32:bd=40;32;01:cd=40;32;01:or=01;31:mi=01;31:ex=00;32:*.cmd=00;32:*.exe=00;32:*.com=00;32:*.btm=00;32:*.bat=00;32:*.sh=00;32:*.csh=00;32:*.jpg=00;35:*.jpeg=00;35:*.gif=00;35:*.png=00;35:*.JPG=05;35:*.JPEG=05;35:*.GIF=05;35:*.PNG=05;35:*.tif=00;35:*.ico=00;35:*.avi=00;35:*.mov=00;35:*.wmv=00;35:*.mp3=00;35:*.flv=00;35:*.bmp=00;35:*.xbm=00;35:*.xpm=00;35:*.doc=04;35:*.pdf=04;35:*.xls=04;35:*.DOC=04;05;35:*.PDF=04;05;35:*.XLS=04;05;35:*.php=00:*.html=00:*.pl=00;33:*.js=00;33:*.c=00;33:*.cpp=00;33:*.css=00;36:*.h=00;36:*.htm=05:*.phtml=05:*.PHP=05:*.HTML=05:*.HTM=05:*.PHTML=05:*.PL=05;33:*.JS=05;33:*.C=05;33:*.CPP=05;33:*.CSS=05;36:*.H=05;36:'
    fi
else
    echo "shortshell bashrc unknown OSTYPE: $OSTYPE"
fi

# Force eval of .dir_colors on systems with dircolors
if [ -x /usr/bin/dircolors ]; then
    eval "`dircolors -b .dir_colors`"
fi

# Define ls with flags
alias ls="ls -h -F $LSFLAG"



## Define color-highlighted grep
export GREP_COLOR='30;43'
alias grep='grep --color=auto'


## Define color-highlighted diff
alias diff="$SHORTPATH/bin/cdiff.sh"


## Vim shortcuts
alias v='vim'
alias vi='vim'


# Start an HTTP server from a directory
alias server="open http://localhost:9999/ && python -m SimpleHTTPServer 9999"


## Set width of tabs to 4 in case we encounter hard tabs in diff, grep, etc
tabs -4


## Set CVS editor
export CVSEDITOR=vim

## Set SVN editor
export SVN_EDITOR=vim

## Set Git editor
git config --global core.editor "vim"


## Define dirsize tool to get directory contents disk size
if [ -n "$(echo $OSTYPE | grep $DARWIN)" ]; then
    alias dirsize='echo "Use Finder"'
elif [ $OSTYPE == $LINUX ]; then    
    alias dirsize='du -sSh .'
else
    echo "shortshell bashrc unknown OSTYPE: $OSTYPE"
fi


## Define searchbytype tool to search through a certain type of file
alias searchbytype='$SHORTPATH/bin/searchbytype.sh'


## Define hop tool
alias hop=". $SHORTPATH/bin/hop.sh"
alias back='hop back'
