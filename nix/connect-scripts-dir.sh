#!/bin/bash
set -euo pipefail

git_root=$(git rev-parse --show-toplevel)

# Set up the scripts directory for both users.
for user in "shad0wfyr3" "dr_dvorak" ; do

    dst="${git_root}/release"
    user_dir="$HOME/.config/hackmud/${user}/scripts"
    mkdir -p $user_dir

    echo 'Linking $src to $dst:'
    echo "  [src] ${dst}"
    echo "  [dst] ${user_dir}"

    rm -rf $user_dir
    ln -s "${dst}" "${user_dir}"

    echo "Done."

done
