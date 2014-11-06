#!/bin/sh

# Check for uncommitted changes or untracked files
[ -n "$(git status --porcelain)" ] && git status && exit 1

git branch -D master
git checkout -b master
git filter-branch --subdirectory-filter _site/ -f
git checkout source
git push --all origin
