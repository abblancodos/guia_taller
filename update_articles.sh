#!/bin/bash

# Path to the articles.json file
ARTICLES_JSON="articles.json"

# Get the list of markdown files in the repository, excluding README.md
MD_FILES=$(find . -name "*.md" | sed 's|^./||' | grep -v "README.md")

# Create an empty array to hold the articles
ARTICLES=()

# Loop through each markdown file and add it to the articles array
for FILE in $MD_FILES; do
  # Extract the file name without the .md extension
  NAME=$(basename "$FILE" .md)
  
  # Add the file to the articles array
  ARTICLES+=("{\"name\": \"$NAME\", \"path\": \"$FILE\"}")
done

# Join the articles array into a JSON array
JSON_ARTICLES=$(IFS=, ; echo "[${ARTICLES[*]}]")

# Write the JSON array to the articles.json file
echo "$JSON_ARTICLES" > "$ARTICLES_JSON"

# Print a success message
echo "Updated $ARTICLES_JSON with the following files:"
echo "$MD_FILES"
