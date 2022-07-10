#!/bin/bash
set -e
docker build .
npm version ${1:-patch}
VERSION=$(awk '/version/{gsub(/("|",)/,"",$2);print $2}' package.json)
echo "Building version $VERSION"
docker build -t dungviettran89/dr-auto-submit:$VERSION .
docker push dungviettran89/dr-auto-submit:$VERSION
docker tag dungviettran89/dr-auto-submit:$VERSION dungviettran89/dr-auto-submit:latest
docker push dungviettran89/dr-auto-submit:latest
npm publish --tag=latest --access public
git push
git push --tags