" This line should not be removed as it ensures that various options are
" properly set to work with the Vim-related packages.
runtime! archlinux.vim


" ---------------------------------------------
" General Settings
" ---------------------------------------------
set t_Co=256
set encoding=utf-8
set nocompatible               " Be improved
set mouse=a                    " Enable mouse
set hidden                     " Quick buffer switching
set ruler                      " Show cursor position
set timeout ttimeoutlen=200    " Removes slight lag after typing the leader key + command


" ---------------------------------------------
" Appearance Settings
" ---------------------------------------------
syntax on
filetype on

set background=dark
"let base16colorspace=256
colorscheme OceanicNext
"colorscheme solarized
"colorscheme one


let g:solarized_termcolors=256


set linespace=0
set showcmd
set number                     " Line numbers
set cursorline                 " Highlights cursor line
set laststatus=2               " Show statusline even when no window split
set scrolloff=2                " Keep 2 scroll lines above/below cursor

" ---------------------------------------------
" Tab Settings
" ---------------------------------------------
set expandtab                  " Tab -> Space
set tabstop=2                  " Tabs count for 4 columns
set softtabstop=2              " Tab == 4 spaces
set shiftwidth=2               " 4 Columns with reindent options
set backspace=indent,eol,start " Smart backspace
set autoindent                 " Ignore case
set smartindent                " Except with capitals
set copyindent                 " copy the previous indentation on autoindenting
set pastetoggle=<F2>           " Disabling autoindent while pasting


" ---------------------------------------------
" Searching and History Settings
" ---------------------------------------------
set hlsearch                   " Highlight search matches
set incsearch                  " Increment search
set ignorecase                 " Case-insensitive search;
set smartcase                  " Search becomes case sensitive if caps used
set nobackup                   " Don't keep backups
set noswapfile                 " Don't create a swap file
set history=50                 " Keep 50 lines of command line history


" ---------------------------------------------
" Bell
" ---------------------------------------------
set noerrorbells               " Disable annoying beeps
set visualbell                 " Visual bell instead of beeping


" ---------------------------------------------
" Code Folding
" ---------------------------------------------
set foldenable                 " Enable code folding
set foldmethod=manual          " But do it manually


" ---------------------------------------------
" Misc
" ---------------------------------------------
" Suffixes that get lower priority when doing tab completion for filenames.
" These are files we are not likely to want to edit or read.
set suffixes=.bak,~,.swp,.o,.info,.aux,.log,.dvi,.bbl,.blg,.brf,.cb,.ind,.idx,.ilg,.inx,.out,.toc


" Adds json code highlighting
autocmd BufNewFile,BufRead *.json set ft=javascript


" ---------------------------------------------
" Plugin Settings
" ---------------------------------------------

" To disable a plugin, add it's bundle name to the following list
" let g:pathogen_disabled = []

" Pathogen Plugin Management
"execute pathogen#infect()


call plug#begin('~/.vim/plugged')

Plug 'scrooloose/nerdtree'
Plug 'ctrlpvim/ctrlp.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'mhartington/oceanic-next'
Plug 'rakr/vim-one'
Plug 'mustache/vim-mustache-handlebars'
Plug 'mattn/emmet-vim'
Plug 'altercation/vim-colors-solarized'

" Add plugins to &runtimepath
call plug#end()


" ---------------------------------------------
" Plugin Settings
" ---------------------------------------------

" Airline ---
let g:airline_powerline_fonts=1
let g:airline_theme='one'

" CtrlP ---

" Set no max file limit
let g:ctrlp_max_files = 0

" Ignore these directories
set wildignore+=*/node_modules/**
set wildignore+=*/vendor/**
set wildignore+=*/bower_compoents/**


" ---------------------------------------------
" Custom Mappings
" ---------------------------------------------
" Use Tab to expand in vim emmet
imap <expr> <tab> emmet#expandAbbrIntelligent("\<tab>")

" With a map leader it's possible to do extra key combinations
let mapleader = ","
let g:mapleader = ","

" Navigate between tabs
nnoremap <C-Left> :tabprevious<CR>
nnoremap <C-Right> :tabnext<CR>

" Show/Hide line numbers
map <Leader>nn :set nonumber<cr>
map <Leader>n :set number<cr>

" Toggle NerdTree plugin
nmap <C-b> :NERDTreeToggle<cr>

" Remove search higlight. Backslash
nmap <Bslash> :noh<cr>

" Toggle Unite recursive file search - requires vimproc plugin
nmap <C-p> :Unite -start-insert file_rec/async -default-action=tabopen<cr>

