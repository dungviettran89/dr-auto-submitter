#!/bin/bash
npm version prepatch --no-git-tag-version
VERSION=$(awk '/version/{gsub(/("|",)/,"",$2);print $2}' package.json)
echo "Building version $VERSION"
docker build -t dungviettran89/dr-auto-submit:$VERSION .
docker push dungviettran89/dr-auto-submit:$VERSION
docker tag dungviettran89/dr-auto-submit:$VERSION dungviettran89/dr-auto-submit:rc
docker push dungviettran89/dr-auto-submit:rc
npm publish --tag=next --access public