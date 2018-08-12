# Color shortcuts
RED=$fg[red]
YELLOW=$fg[yellow]
GREEN=$fg[green]
WHITE=$fg[white]
BLUE=$fg[blue]
CYAN=$fg[cyan]
RED_BOLD=$fg_bold[red]
YELLOW_BOLD=$fg_bold[yellow]
GREEN_BOLD=$fg_bold[green]
WHITE_BOLD=$fg_bold[white]
BLUE_BOLD=$fg_bold[blue]
CYAN_BOLD=$fg_bold[cyan]
RESET_COLOR=$reset_color

# Format for git_prompt_info()
ZSH_THEME_GIT_PROMPT_PREFIX=""
ZSH_THEME_GIT_PROMPT_SUFFIX=""

# Format for parse_git_dirty()
ZSH_THEME_GIT_PROMPT_DIRTY=" %{$RED%}🔥"
ZSH_THEME_GIT_PROMPT_CLEAN=" %{$GREEN%}☘️"

# Format for git_prompt_status()
ZSH_THEME_GIT_PROMPT_UNMERGED=" %{$RED%}unmerged"
ZSH_THEME_GIT_PROMPT_DELETED=" %{$RED%}deleted"
ZSH_THEME_GIT_PROMPT_RENAMED=" %{$YELLOW%}renamed"
ZSH_THEME_GIT_PROMPT_MODIFIED=" %{$YELLOW%}modified"
ZSH_THEME_GIT_PROMPT_ADDED=" %{$GREEN%}added"
ZSH_THEME_GIT_PROMPT_UNTRACKED=" %{$WHITE%}untracked"

# Format for git_prompt_ahead()
ZSH_THEME_GIT_PROMPT_AHEAD=" %{$RED%}❗"

# Format for git_prompt_long_sha() and git_prompt_short_sha()
ZSH_THEME_GIT_PROMPT_SHA_BEFORE=" %{$WHITE%}[%{$YELLOW%}"
ZSH_THEME_GIT_PROMPT_SHA_AFTER="%{$WHITE%}]"

git_custom_status() {
  # local cb=$(git_current_branch)
  if [ -n "$(git_current_branch)" ]; then
    echo "$(parse_git_dirty)$(git_prompt_ahead)"
  fi
}

if [[ -n $SSH_CONNECTION ]]; then
  EMOJI_USER="%{$CYAN_BOLD%}👽 %n%{$RESET_COLOR%}%{$CYAN%}"
else
  EMOJI_USER="%{$GREEN_BOLD%}🦄 %n%{$RESET_COLOR%}%{$GREEN%}"
fi

# Prompt format
PROMPT='
%{$EMOJI_USER%}@%m%{$RESET_COLOR%}%{$WHITE%}:%{$YELLOW%}%~%u$(git_custom_status)%{$RESET_COLOR%}
%{$BLUE%}➜%{$RESET_COLOR%} '
RPROMPT='%{$GREEN_BOLD%}$(git_current_branch)$(git_prompt_short_sha)$(git_prompt_status)%{$RESET_COLOR%}'
