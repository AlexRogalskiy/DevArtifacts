# ---------------------------------
# TERMINAL CUSTOMIZATION
# ---------------------------------

# Set CLICOLOR if you want Ansi Colors in iTerm2
export CLICOLOR=1

# Set colors to match iTerm2 Terminal Colors
export TERM=xterm-256color

# Set different colours for files and folders incase of linux
# http://geoff.greer.fm/lscolors/
LS_COLORS='no=00:di=31:tw=33;01:ow=33;01:ex=32:ln=36'
LS_COLORS=$LS_COLORS':fi=00:pi=00:so=00:bd=00:cd=00:or=00:mi=00'
LS_COLORS=$LS_COLORS':*.tgz=31:*.gz=31:*.zip=31:*.bz2=31:*.tar=31'
export LS_COLORS

#Custom Prompt

#Custom Colours
txtblk='\e[0;30m' # Black - Regular
txtred='\e[0;31m' # Red
txtgrn='\e[0;32m' # Green
txtylw='\e[0;33m' # Yellow
txtblu='\e[0;34m' # Blue
txtpur='\e[0;35m' # Purple
txtcyn='\e[0;36m' # Cyan
txtwht='\e[0;37m' # White

bldblk='\e[1;30m' # Black - Bold
bldred='\e[1;31m' # Red
bldgrn='\e[1;32m' # Green
bldylw='\e[1;33m' # Yellow
bldblu='\e[1;34m' # Blue
bldpur='\e[1;35m' # Purple
bldcyn='\e[1;36m' # Cyan
bldwht='\e[1;37m' # White

txtrst='\e[0m'    # Text Reset

print_before_the_prompt () {
    printf "\n$txtgrn%s: $txtylw%s\n$txtrst" "$USER" "$PWD"
}

PROMPT_COMMAND=print_before_the_prompt

PS1='-> '

bind "set completion-ignore-case on"    # Makes Bash Tab Completion Case Insensetive
# bind "set show-all-if-ambiguous on"     # Makes pressing tab twice unessary


# ---------------------------------
# ALIASES
# ---------------------------------

# Custom Aliases
alias c="clear"
alias remove="rm -rf"


# Laravel Alias
alias art="php artisan"
alias unit="./vendor/bin/phpunit"

# Dotfile Aliases
alias bashconfig="vi ~/.bash_profile"
alias gitconfig="git config -e --global"
alias vimconfig="vi ~/.vimrc"

alias bashreload=". ~/.bash_profile"
