#!/bin/bash

# WARNING: Just an example. Use `npm run package:build` npm script.
# Not comfrotable usable under Windows environment. Neither is up to date.

DEST_FOLDER="./.delivery/.builds/dist"

npm run test:foundation

echo "Clean up the delivery build folder"
npx rimraf $DEST_FOLDER

echo "Compile the project"
npx tsc -p ./.delivery/configuration/tsconfig.json

echo "Copy bundle files"
npx cpy ./package.json $DEST_FOLDER
npx cpy ./tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json $DEST_FOLDER/examples --flat 

# Your build script commands
echo "Build completed!"
# Prevent the terminal from closing immediately
read -p "Press Enter to exit..."