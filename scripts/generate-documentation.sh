#!/bin/bash

package_name=$(jq -r ".name" <<< cat "./package.json")

typedoc_output_directory="docs"

typedoc_arguments=(
  "--searchInComments"
  "--darkHighlightTheme" "dracula"
  "--githubPages"
  "--out" "$typedoc_output_directory"
  "--tsconfig" "./tsconfig.json"
  "--entryPoints" "./**/*.ts"
  "--exclude" "node_modules"
  "--exclude" "./**/*.d.ts"
  "--name" "$package_name"
  "--hostedBaseUrl" "https://victorqueiroz.github.io/$package_name"
)

# Generate the documentation
npx typedoc "${typedoc_arguments[@]}"

# Move the generated documentation to the root directory
rsync --remove-source-files -avz --progress -r "${typedoc_output_directory}/" .

# Remove empty directories
find . -type d -empty -delete