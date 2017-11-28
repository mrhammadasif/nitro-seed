#!/bin/bash

# Change dir to the working directory
cd "/path/to/the/folder/on/server"

# fetch latest code from the git repo
git checkout -b dist origin/dist
git fetch
git pull

# hard reset the base to reset all of the changes
git reset --hard origin/dist
git clean -f -d

# remove the node_moduels and reinstall all prod modules
rm ./node_modules/ -r

# see if global typescript is required to update
npm i -g typescript

# install libraries if missing
# TODO: make all require libs move to prod
npm i --force

# compile all files in tsconfig
tsc -p .

# restart all pm2 instances after this
pm2 delete --silent nameProject
pm2 start dist/index.js -i 2 --name=nameProject