echo "Ensure the destination folder exists before running the script."

git log --oneline --pretty='%h %ad %an %s' --date=short | 

while read line; do
  if git log --merges --oneline --pretty='%h' | grep -q $(echo $line | cut -d' ' -f1); then
    echo "Merge" $line
  else
    echo "  $line"
  fi
done
