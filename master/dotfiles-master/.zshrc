# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh
export ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="agnoster-custom"

# Report CPU usage for commands running longer than 10 seconds
REPORTTIME=1

# Aliases

alias zshconfig="vim ~/.zshrc"
alias gitconfig="vim ~/.gitconfig"
alias vimconfig="vim ~/.vimrc"
alias resize-50="ogrify *.JPG -resize 50% *"
alias optimizejpeg="convert -strip -interlace Plane -gaussian-blur 0.05 -quality 93% shop$1 $2"
alias ffww="find $2 -type f -exec grep $1 {} /dev/null \;"

alias downloads="cd ~/Downloads"
alias odownloads="open ~/Downloads"
alias serve="http-server"

# Git aliases

alias master="git co master"
alias dev="git co develop"
alias ghp="git co gh-pages"
alias st="git st"
alias fp="git fp"
alias fpmm="git fp && git mm"
alias lg="git lg"
alias gs="git s"
alias gsp="git sp"
alias prevcommit="git checkout `git rev-list --topo-order HEAD..$1 | tail -1`"
alias tagnpush="npm version patch && git push origin master --tags"

#
#
# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Uncomment this to disable bi-weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment to change how often before auto-updates occur? (in days)
# export UPDATE_ZSH_DAYS=13

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want to disable command autocorrection
# DISABLE_CORRECTION="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# Uncomment following line if you want to disable marking untracked files under
# VCS as dirty. This makes repository status check for large repositories much,
# much faster.
DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment following line if you want to  shown in the command execution time stamp 
# in the history command output. The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|
# yyyy-mm-dd
# HIST_STAMPS="mm/dd/yyyy"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(git)

source $ZSH/oh-my-zsh.sh

# User configuration

export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin"

# export MANPATH="/usr/local/man:$MANPATH"

# # Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/dsa_id"

ulimit -n 2048

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting

. `brew --prefix`/etc/profile.d/z.sh

export NVM_DIR="/Users/kushagragour/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
