"execute pathogen#infect()

let g:molokai_original = 1
let g:SimpylFold_docstring_preview=1
let g:ycm_autoclose_preview_window_after_completion=1
let g:nerdtree_tabs_open_on_console_startup = 1
let NERDTreeIgnore=['\.pyc$', '\~$'] "ignore files in NERDTree

let mapleader=","

autocmd vimenter * NERDTree
map <C-n> :NERDTreeToggle<CR>
map <leader>g  :YcmCompleter GoToDefinitionElseDeclaration<CR>

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

" alternatively, pass a path where Vundle should install plugins
"call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'gmarik/Vundle.vim'

" Add all your plugins here (note older versions of Vundle used Bundle instead of Plugin)
Plugin 'tmhedberg/SimpylFold'
Plugin 'vim-scripts/indentpython.vim'
"Plugin 'Valloric/YouCompleteMe'
Plugin 'scrooloose/nerdtree'
Plugin 'jistr/vim-nerdtree-tabs'
Plugin 'kien/ctrlp.vim'
Plugin 'tpope/vim-fugitive'
"Plugin 'Lokaltog/powerline', {'rtp': 'powerline/bindings/vim/'}
Plugin 'jnurmine/Zenburn'
Plugin 'altercation/vim-colors-solarized'
"Plugin 'elixir-lang/vim-elixir'

" All of your Plugins must be added before the following line
call vundle#end()            " required

if has('gui_running')
  set background=dark
  colorscheme solarized
else
  colorscheme zenburn
endif

set guifont=Source\ Code\ Pro\ for\ Powerline "make sure to escape the spaces in the name properly
set splitright
set splitbelow
set clipboard=unnamed

"split navigations
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>

" Enable folding
set foldmethod=indent
set foldlevel=99

" Enable folding with the spacebar
nnoremap <space> za

"au BufNewFile,BufRead *.py
"    \ set tabstop=4
"    \ set softtabstop=4
"    \ set shiftwidth=4
"    \ set textwidth=79
"    \ set noexpandtab
"    \ set autoindent
"    \ set fileformat=unix

au BufNewFile *.js, *.html, *.css
    \ set tabstop=2
    \ set softtabstop=2
    \ set shiftwidth=2

"au BufRead,BufNewFile *.py,*.pyw,*.c,*.h match BadWhitespace /\s\+$/
set encoding=UTF-8

"python with virtualenv support
"python << EOF
"import os
"import sys
"if 'VIRTUAL_ENV' in os.environ:
"  project_base_dir = os.environ['VIRTUAL_ENV']
"  activate_this = os.path.join(project_base_dir, 'bin/activate_this.py')
"  execfile(activate_this, dict(__file__=activate_this))
"EOF

" move upwards if tags not found
:se tags=tags,~/tags;/
" not working due to python indentation, commenting
"if (v:version >= 600)
"    filetype plugin indent on
"    nmap <F13> :call BE()<CR>
"    highlight! link Folded StatusLine
"
"    function BE()
"        if ! exists('b:folding')
"            syntax region myFold start='{' end='}' transparent fold
"            syntax sync fromstart
"            set foldmethod=syntax
"            set foldlevel=1
"            normal zR
"        endif
"    endfunction
"endif

set nocompatible " dont be compatible with vi-mode
set noautoindent
set backspace=2     " standardize on backspace key
set nobackup        " backup is not necessary
set cinkeys-=o,O
set cinoptions+=:0g0
set comments+=nb:>
set cpoptions-=B
set noequalalways
"set expandtab
set guifont=ProggyCleanTT\ 12
set guioptions-=T
set hlsearch
set ignorecase
set incsearch
set infercase
set nojoinspaces
set laststatus=2
set list
set listchars=tab:>\ ,trail:+
set matchpairs+=<:>
set nrformats-=octal,hex
set scrolloff=1
set shiftround
set shiftwidth=4
set showcmd
set showmatch
set smartcase
"set smarttab
set softtabstop=4
set tabstop=4
set splitbelow
set statusline=%f\ %y%r%1*%m%*%=%<x%02B%4vv%4cc%7l\ %P
highlight! link User1 ErrorMsg
set timeoutlen=100
set title
set wildignore+=*.o,*.obj,*.cmi,*.cmo,*.cma,*.cmx,*.a,*.cmxa,*.rem
set wildignore+=*.aux,*.blg,*.dvi,*.log,*.pdf,*.ps
set nowritebackup

autocmd BufEnter *              let &titlestring = hostname() . ':' . expand('%f')

autocmd FileType help           nmap <C-m> <C-]>
autocmd FileType html           setlocal indentkeys-=o,O,*<Return>,<>>,<bs>
autocmd FileType mail           setlocal textwidth=76
autocmd FileType yaml           syntax off

autocmd BufRead *.*html*        setlocal filetype=html
autocmd BufRead *.css*          setlocal filetype=css
"autocmd BufRead *.js*          setlocal filetype=html
autocmd BufRead *.txt*          setlocal textwidth=76

map ' :
noremap ,, \'
nmap Y y$
nmap <M-j>      <C-w>w
nmap <M-k>      <C-w>W

nmap <F1>       :write<CR>
map! <F1>       <C-v>u
nmap <F21>      :write!<CR>
nmap <F2>       :make<CR>
nmap <F22>      :copen<CR><C-g>
nmap <F3>       :shell<CR>
nmap <F4>       :quit<CR>
nmap <F14>      :qall<CR>

nmap <F5>       :set hlsearch!<CR>
nmap <F15>      :set ignorecase!<CR>
nmap <F16>      :set makeprg=nn\ %<CR>
nmap <F17>      :set makeprg=gg\ %<CR>
nmap <F8>       <C-w>w

let python_highlight_all=1
syntax on
set synmaxcol=120

set secure
set t_co=256
" set   iskeyword+=^_
map mn :tabnext<CR>
map mb :tabprev<CR>
set cursorline
set pastetoggle=<F7>
highlight CursorLine	cterm=underline
highlight Visual cterm=reverse term=reverse

set tabstop=4
set noexpandtab
" zM : close all folds, zR : open all folds
set mouse=a	" enable mouse
