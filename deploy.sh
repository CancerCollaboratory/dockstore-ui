#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "feature/issue-572" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)
grunt ngdocs
cd docs
git init
git config user.name "garyluu"
git config user.email "garylau.work@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/ga4gh/dockstore-ui.git"
git fetch upstream
git reset upstream/gh-pages

touch .

echo "ngdocs.com" > CNAME

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
