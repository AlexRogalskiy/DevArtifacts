if [ -f ~/.profile ]; then
  source ~/.profile
fi

# paths
NPM_PACKAGES="$HOME/.npm-packages"
NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"

export PATH="$HOME/bin:/usr/local/bin:$PATH"
export PATH="/usr/local/git/bin:$PATH"
export PATH="$NPM_PACKAGES/bin:$PATH"
export PATH="$HOME/.cargo/bin:$PATH"

export PATH="/usr/local/sbin:$PATH"

# use Homebrew python
export PATH="/usr/local/opt/python/libexec/bin:$PATH"

export EDITOR="vim"

#alias gcc="gcc-7"
#alias cc="gcc-7"
#alias g++="g++-7"
#alias c++="c++-7"

#export CC=/usr/local/bin/gcc-7
#export CXX=/usr/local/bin/g++-7
#export CPP=/usr/local/bin/cpp-7
#export LD=/usr/local/bin/gcc-7

#alias c++=/usr/local/bin/c++-7
#alias g++=/usr/local/bin/g++-7
#alias gcc=/usr/local/bin/gcc-7
#alias cpp=/usr/local/bin/cpp-7
#alias ld=/usr/local/bin/gcc-7
#alias cc=/usr/local/bin/gcc-7

eval "$(rbenv init -)"
