#!/bin/bash
set -euo pipefail

git_root=$(git rev-parse --show-toplevel)

# Set up the scripts directory for both users.
for user in "shad0wfyr3" "dr_dvorak" ; do

    user_dir="$HOME/.config/hackmud/${user}/scripts"
    mkdir -p $user_dir

    echo 'Linking $src to $dst:'
    echo "  [src] ${git_root}"
    echo "  [dst] ${user_dir}"

    rm -rf $user_dir
    ln -s "${git_root}" "${user_dir}"

    echo "Done."

done
