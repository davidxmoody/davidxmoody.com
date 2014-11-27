#!/bin/sh

set -e

# Check for uncommitted changes or untracked files
[ -n "$(git status --porcelain)" ] && git status && exit 1

# Switch to master branch without changing any files
git symbolic-ref HEAD refs/heads/master
git reset

# Add all changes in the build dir
git --work-tree=build add -A
git --work-tree=build commit -m "Published changes"

# Switch back to source
git symbolic-ref HEAD refs/heads/source
git reset

# Push both branches to GitHub
git push --all origin
