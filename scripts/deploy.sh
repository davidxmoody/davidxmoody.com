#!/bin/sh

set -e

# Check for uncommitted changes or untracked files
[ -n "$(git status --porcelain)" ] && git status && exit 1

git subtree push --squash --prefix build/ . master
git push --all origin
