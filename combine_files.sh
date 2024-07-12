#!/bin/bash

# Define the output file
OUTPUT_FILE="project_combined.txt"

# Delete the output file if it already exists
rm -f "$OUTPUT_FILE"

# Get the absolute path of the current directory
CURRENT_DIR=$(pwd)

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
        # Exclude the output file and package-lock.json to prevent self-inclusion and large size
        if [[ "$item" == "$CURRENT_DIR/$OUTPUT_FILE" ]] || [[ "$(basename "$item")" == "package-lock.json" ]]; then
            continue
        fi
        
        # Check if the item is within the current project directory
        if [[ "$item" == "$CURRENT_DIR"/* ]]; then
            if [ -d "$item" ]; then
                echo "${indent}# Directory: $(basename "$item")" >> "$OUTPUT_FILE"
                combine_files "$item" "$indent  "
            elif [ -f "$item" ] && is_text_file "$item"; then
                echo "${indent}# File: $(basename "$item")" >> "$OUTPUT_FILE"
                echo "${indent}--- Start of $(basename "$item") ---" >> "$OUTPUT_FILE"
                
                if [ -r "$item" ]; then
                    echo "${indent}\`\`\`" >> "$OUTPUT_FILE"
                    cat "$item" >> "$OUTPUT_FILE"
                    echo "${indent}\`\`\`" >> "$OUTPUT_FILE"
                else
                    echo "${indent}WARNING: No read permission for this file" >> "$OUTPUT_FILE"
                fi
                
                echo "${indent}--- End of $(basename "$item") ---" >> "$OUTPUT_FILE"
                echo >> "$OUTPUT_FILE"
            fi
        fi
    done
}

# List packages from package.json
if [ -f "package.json" ]; then
    echo "# Packages used:" >> "$OUTPUT_FILE"
    jq -r 'if .dependencies then .dependencies | to_entries[] | "\(.key) \(.value)" else empty end, if .devDependencies then .devDependencies | to_entries[] | "\(.key) \(.value)" else empty end' package.json >> "$OUTPUT_FILE"
    echo >> "$OUTPUT_FILE"
fi

# Start combining files from the current directory
combine_files "$CURRENT_DIR" ""

echo "Files and folder structure have been combined into $OUTPUT_FILE"
