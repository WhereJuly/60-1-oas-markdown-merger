# This is the basic PoC solution implementation. See the comment in
# `pre-push` file.`
branch=$(git rev-parse --abbrev-ref HEAD)

get_changed_folders() {
    git diff --name-only --staged "origin/$branch" | cut -d/ -f1 | sort -u
}

folders_await_pushing=$(get_changed_folders) || exit 0

echo "$folders_await_pushing"