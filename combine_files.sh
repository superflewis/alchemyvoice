#!/bin/bash

# Define the output file
OUTPUT_FILE="project_combined.txt"

# Clear the output file if it already exists
> $OUTPUT_FILE

# Function to check if a file is a text file
is_text_file() {
    local file="$1"
    local mime_type=$(file -b --mime-type "$file")
    
    [[ $mime_type == text/* || $mime_type == application/json || $mime_type == application/javascript ]] || \
    [[ $file =~ \.(txt|js|json|md|py|sh|conf|css|html|htm|xml|yml|yaml|ini|cfg|log)$ ]]
}

combine_files() {
    local dir=$1
    local indent=$2
    
    for item in "$dir"/*; do
        if [ -d "$item" ]; then
            echo "${indent}Directory: $(basename "$item")" >> $OUTPUT_FILE
            combine_files "$item" "$indent  "
        elif [ -f "$item" ] && is_text_file "$item"; then
            echo "${indent}File: $(basename "$item")" >> $OUTPUT_FILE
            echo "${indent}--- Start of $(basename "$item") ---" >> $OUTPUT_FILE
            
            if [ -r "$item" ]; then
                cat "$item" >> $OUTPUT_FILE
            else
                echo "${indent}WARNING: No read permission for this file" >> $OUTPUT_FILE
            fi
            
            echo "${indent}--- End of $(basename "$item") ---" >> $OUTPUT_FILE
            echo >> $OUTPUT_FILE
        fi
    done
}

# List packages from package.json
if [ -f "package.json" ]; then
    echo "Packages used:" >> $OUTPUT_FILE
    jq -r 'if .dependencies then .dependencies | to_entries[] | "\(.key) \(.value)" else empty end, if .devDependencies then .devDependencies | to_entries[] | "\(.key) \(.value)" else empty end' package.json >> $OUTPUT_FILE
    echo >> $OUTPUT_FILE
fi

# Start combining files from the current directory
combine_files "." ""

echo "Files and folder structure have been combined into $OUTPUT_FILE"
