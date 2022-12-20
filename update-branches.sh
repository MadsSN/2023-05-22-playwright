set -e

git checkout main

branches=(main 1-start 2-basics 3-advanced 4-beyond-e2e)
previous=
current=

for branch in ${branches[*]}; do
  previous=$current
  current=$next
  next=$branch

  if [ ! $current = "" ]; then
    git checkout $current
    git tag -d $(git tag | grep -E '.')
    git merge $previous -m merge
  fi
done

git checkout $branch
git merge $current $branch -m merge

git checkout main
