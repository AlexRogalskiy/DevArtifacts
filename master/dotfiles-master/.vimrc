" Vim
set nocompatible
filetype off

set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'
Plugin 'scrooloose/nerdtree'
Plugin 'ctrlpvim/ctrlp.vim'
Plugin 'tpope/vim-fugitive'
Plugin 'rust-lang/rust.vim'
Plugin 'mustache/vim-mustache-handlebars'
Plugin 'pangloss/vim-javascript'
Plugin 'mxw/vim-jsx'
call vundle#end()
filetype plugin indent on

" Use the OS clipboard by default (on versions compiled with `+clipboard`)
set clipboard=unnamed

" Enhance command-line completion
set wildmenu

" Allow cursor keys in insert mode
set esckeys

" Allow backspace in insert mode
set backspace=indent,eol,start

" Optimize for fast terminal connections
set ttyfast

" Add the g flag to search/replace by default
set gdefault

" Use UTF-8
set encoding=utf-8
set fileencoding=utf-8

" Change mapleader
let mapleader=","
" Don’t add empty newlines at the end of files
" set binary
" set noeol

set viminfo+=n~/.vim/viminfo
" Centralize backups, swapfiles and undo history
set backupdir=~/.vim/backups
set directory=~/.vim/swaps
if exists("&undodir")
	set undodir=~/.vim/undo
endif
set undofile

" Respect modeline in files
set modeline
set modelines=4

" Enable per-directory .vimrc files and disable unsafe commands in them
set exrc
set secure

" Highlight searches
set hlsearch

" Ignore case of searches
set ignorecase

" Highlight dynamically as pattern is typed
set incsearch

" Always show status line
set laststatus=2

" Enable mouse in all modes
set mouse=a

" Disable error bells
set noerrorbells

" Don’t reset cursor to start of line when moving around.
set nostartofline

" Don’t show the intro message when starting Vim
set shortmess=atI

" Show the current mode
set showmode

" Show the filename in the window titlebar
set title

" Show the (partial) command as it’s being typed
set showcmd

" Use relative line numbers
" if exists("&relativenumber")
" 	set relativenumber
" 	au BufReadPost * set relativenumber
" endif

" Start scrolling three lines before the horizontal window border
set scrolloff=10

" Strip trailing whitespace (,ss)
" function! StripWhitespace()
" 	let save_cursor = getpos(".")
" 	let old_query = getreg('/')
" 	:%s/\s\+$//e
" 	call setpos('.', save_cursor)
" 	call setreg('/', old_query)
" endfunction
" noremap <leader>ss :call StripWhitespace()<CR>

" Save a file as root (,W)
" noremap <leader>W :w !sudo tee % > /dev/null<CR>

" Automatic commands
" if has("autocmd")
" 	" Enable file type detection
" 	filetype on
" 	" Treat .json files as .js
" 	autocmd BufNewFile,BufRead *.json setfiletype json syntax=javascript
" endif

set splitbelow
set splitright

let g:ctrlp_custom_ignore = '\v[\/](node_modules|target|dist)|(\.(swp|git|svn|sass-cache))$'

" ********************
" *  Visual Options  *
" ********************

set colorcolumn=81

" Enable line numbers
set number

" Enable syntax highlighting
syntax enable

" highlight matching parenthesis and brackets
set showmatch
set t_Co=256
colorscheme dbushell
set background=dark

" highlight comment cterm=italic
" highlight htmlArg cterm=italic

" Highlight current line
set cursorline

" Make tabs as wide as two spaces
set tabstop=2

set shiftwidth=2

set expandtab

" Show the cursor position
set ruler

" Show “invisible” characters
set listchars=tab:»\ ,extends:›,precedes:‹,nbsp:·,trail:·,eol:¬
set list

" highlight comment cterm=italic gui=italic
" highlight htmlArg cterm=italic

" autocmd vimenter * NERDTree

" How can I map a specific key or shortcut to open NERDTree?
map <C-n> :NERDTreeToggle<CR>
" How can I close vim if the only window left open is a NERDTree?
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif

" Hyper / Airline bug - https://github.com/zeit/hyper/issues/1037
set t_RV=
