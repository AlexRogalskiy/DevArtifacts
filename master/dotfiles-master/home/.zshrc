# ---------------------------------
# zShell Config
# ---------------------------------

# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# See ambidexter.zsh-theme in .oh-my-zsh/themes/
ZSH_THEME="ambidexter"

# Uncomment following line if you want red dots to be displayed while waiting for completion
COMPLETION_WAITING_DOTS="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
plugins=(git svn composer sublime laravel5 vagrant z npm bower brew zsh-navigation-tools)

source $ZSH/oh-my-zsh.sh

# Base16 Shell
BASE16_SHELL="$HOME/.config/base16-shell/base16-default.dark.sh"
[[ -s $BASE16_SHELL ]] && . $BASE16_SHELL

# Set default editior as vim
export EDITOR='vim'

# don't check for new mail
MAILCHECK=0
MAIL=0


# ---------------------------------
# Dotfiles installation
# ---------------------------------
function install_dotfiles() {
  file=".homesick/repos/dotfiles/install.sh"
  if [ -f "$file" ]
  then
      echo "Installing dotfiles..."
      ./$files
  else
      echo "Install script not found. Install Homesick first - https://github.com/technicalpickles/homesick"
  fi
}




function silo() {
  ( cd ~/Homestead && vagrant $* )
}


# Usage = gzip_size index.js
function gzip_size() {
  gzip -c $1 | wc -c
}






# ---------------------------------
# ALIASES
# ---------------------------------


# Dotfiles --------------------------------
alias zshconfig="vim ~/.zshrc"            # zsh Config
alias vimconfig="vim ~/.vimrc"            # vim Config
alias tmuxconfig="vim ~/.tmux.conf"       # tmux Config
alias gitconfig="git config -e --global"  # git Config

alias zshreload=". ~/.zshrc"             # zsh Reload

alias bootfiles="cd ~/.homesick/repos/dotfiles"


# Mac System Commans --------------------------------
alias killDS="find . -name '*.DS_Store' -type f -delete"    # Removes all .DS_Store files from dir and subdirs

alias hiddenFilesShow='defaults write com.apple.finder AppleShowAllFiles YES; killall Finder /System/Library/CoreServices/Finder.app'
alias hiddenFilesHide='defaults write com.apple.finder AppleShowAllFiles NO; killall Finder /System/Library/CoreServices/Finder.app'


alias desktopIconsHide='defaults write com.apple.finder CreateDesktop false; killall Finder'
alias desktopIconsShow='defaults write com.apple.finder CreateDesktop true; killall Finder'

# Sketch Commands --------------------------------
alias sketchmem="sudo du -sh /.DocumentRevisions-V100"


# Tooling Commands --------------------------------------------
alias fetch="youtube-dl --extract-audio --audio-format mp3"
alias codecourse="php codecourse download"

alias t="tree -CLt 1"
alias t2="tree -CLt 2"

alias hi="hicat"

alias top="vtop"

alias phpserve="php -S localhost:8000"


# Dev Environtment --------------------------------

# Vagrant Shortcut
alias v="vagrant"

# Ace Alias
alias ace="./ace"

# Artisan Aliases
alias artisan="php artisan"
alias art="php artisan"

alias dusk="php artisan dusk"

alias phpunit="./vendor/bin/phpunit"
alias unit="./vendor/bin/phpunit"

# MAMP SQL
alias sql="/Applications/MAMP/Library/bin/mysql --host=localhost -uroot -proot"

# Tmux -----------------------------------------
alias tkill="tmux kill-session -t"



# SVN ---------------------------------------------

# add everything that needs to be added based on results of svn status
alias svnadd="svn st | grep \? | awk '''{print \"svn add \"$2 }''' | bash" 

# show svn status, sans the noise from externals
alias svnst='svn st --ignore-externals'

# Others -----------------------------------------

# Other Aliases
alias c="clear"
alias remove="rm -rf"




# ---------------------------------
# PATH Configs
# ---------------------------------
export PATH=$PATH:/bin:/usr/bin:/usr/local/bin

# Defining and adding MAMP php to path (Comment and uncomment to toggle)
# export MAMP_PHP=/Applications/MAMP/bin/php/php5.6.10/bin
# export PATH="$MAMP_PHP:$PATH"

#As mentioned by Brew Doctor
#export PATH="/usr/local/bin:$PATH"

# For Homestead
#export PATH=~/.composer/vendor/bin:$PATH

#PATH=~/.composer/vendor/bin:$PATH

# ---------------------------------
# Grunt Tab Completion
# ---------------------------------
#eval "$(grunt --completion=zsh)"


export NVM_DIR="/Users/Ghosh/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

### Added by the Heroku Toolbelt
export PATH="/usr/local/heroku/bin:$PATH"
export PATH="/usr/local/sbin:$PATH"


###-begin-npm-completion-###
#
# npm command completion script
#
# Installation: npm completion >> ~/.bashrc  (or ~/.zshrc)
# Or, maybe: npm completion > /usr/local/etc/bash_completion.d/npm
#

if type complete &>/dev/null; then
  _npm_completion () {
    local words cword
    if type _get_comp_words_by_ref &>/dev/null; then
      _get_comp_words_by_ref -n = -n @ -w words -i cword
    else
      cword="$COMP_CWORD"
      words=("${COMP_WORDS[@]}")
    fi

    local si="$IFS"
    IFS=$'\n' COMPREPLY=($(COMP_CWORD="$cword" \
                           COMP_LINE="$COMP_LINE" \
                           COMP_POINT="$COMP_POINT" \
                           npm completion -- "${words[@]}" \
                           2>/dev/null)) || return $?
    IFS="$si"
  }
  complete -o default -F _npm_completion npm
elif type compdef &>/dev/null; then
  _npm_completion() {
    local si=$IFS
    compadd -- $(COMP_CWORD=$((CURRENT-1)) \
                 COMP_LINE=$BUFFER \
                 COMP_POINT=0 \
                 npm completion -- "${words[@]}" \
                 2>/dev/null)
    IFS=$si
  }
  compdef _npm_completion npm
elif type compctl &>/dev/null; then
  _npm_completion () {
    local cword line point words si
    read -Ac words
    read -cn cword
    let cword-=1
    read -l line
    read -ln point
    si="$IFS"
    IFS=$'\n' reply=($(COMP_CWORD="$cword" \
                       COMP_LINE="$line" \
                       COMP_POINT="$point" \
                       npm completion -- "${words[@]}" \
                       2>/dev/null)) || return $?
    IFS="$si"
  }
  compctl -K _npm_completion npm
fi
###-end-npm-completion-###
