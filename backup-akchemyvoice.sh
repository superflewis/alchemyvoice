#!/bin/bash

# Define the backup destination
BACKUP_DIR="/home/williew/backups/alchemyvoice_$(date +'%Y%m%d%H%M%S')"

# Create the backup directory
mkdir -p "$BACKUP_DIR"

# Copy the project to the backup directory
cp -r /home/williew/alchemyvoice "$BACKUP_DIR"