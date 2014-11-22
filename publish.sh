#!/bin/sh

set -e

# Check for uncommitted changes or untracked files
[ -n "$(git status --porcelain)" ] && git status && exit 1

git branch -D gh-pages
git checkout -b gh-pages
git filter-branch --subdirectory-filter build/ -f
git checkout master
git push --all origin
