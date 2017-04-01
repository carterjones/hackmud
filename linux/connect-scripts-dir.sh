#!/bin/bash
set -euo pipefail

git_root=$(git rev-parse --show-toplevel)
hackmud_scripts_parent_dir="$HOME/.config/hackmud/shad0wfyr3/scripts"

echo 'Linking $src to $dst:'
echo "  [src] ${git_root}"
echo "  [dst] ${hackmud_scripts_parent_dir}"

rm -rf $hackmud_scripts_parent_dir
ln -s "${git_root}" "${hackmud_scripts_parent_dir}"

echo "Done."
