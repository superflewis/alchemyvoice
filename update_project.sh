#!/bin/bash

# Navigate to the home directory
cd /home/williew

# If the directory exists, remove it
if [ -d "alchemyvoice" ]; then
    rm -rf alchemyvoice
fi

# Clone the latest version from GitHub
git clone https://github.com/yourusername/yourrepository.git alchemyvoice

# Change permissions if needed
chown -R pi:pi alchemyvoice
