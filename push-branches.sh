set -e

git checkout main

branches=(main 1-start 2-basics 3-advanced 4-beyond-e2e)

for branch in ${branches[*]}; do
  git checkout $branch
  git push $1 $branch
done

git checkout main
