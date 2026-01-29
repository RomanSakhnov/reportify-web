#!/bin/bash

# Deployment script for Reportify Web
# Deploys to reportify.rs-development.net via SSH
# Usage: ./deploy.sh [sudo_password]

set -e  # Exit on any error

# Configuration
SSH_USER="rs-dev"
SSH_HOST="rs-development.net"
SSH_PORT="2121"
REMOTE_PATH="/var/www/reportify-web"
BUILD_DIR="dist"

# Get sudo password from argument or prompt
SUDO_PASSWORD="$1"
if [ -z "$SUDO_PASSWORD" ]; then
    echo "Enter sudo password for $SSH_USER@$SSH_HOST:"
    read -s SUDO_PASSWORD
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting deployment to ${SSH_HOST}...${NC}"

# Step 1: Build the project
echo -e "${BLUE}Building project...${NC}"
yarn build

if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}Build failed! ${BUILD_DIR} directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully!${NC}"

# Step 2: Create a tarball of the build
echo -e "${BLUE}Creating deployment archive...${NC}"
tar -czf reportify-web.tar.gz -C $BUILD_DIR .

# Step 3: Upload to server
echo -e "${BLUE}Uploading files to server...${NC}"
scp -P $SSH_PORT reportify-web.tar.gz $SSH_USER@$SSH_HOST:/tmp/

# Step 4: Extract and deploy on server
echo -e "${BLUE}Deploying on server...${NC}"
ssh -p $SSH_PORT $SSH_USER@$SSH_HOST "bash -s" << ENDSSH
    # Create backup of current deployment
    if [ -d "/var/www/reportify-web" ]; then
        echo "Creating backup..."
        echo '$SUDO_PASSWORD' | sudo -S cp -r /var/www/reportify-web /var/www/reportify-web.backup.\$(date +%Y%m%d_%H%M%S)
    fi

    # Create directory if it doesn't exist
    echo "Creating directory..."
    echo '$SUDO_PASSWORD' | sudo -S mkdir -p /var/www/reportify-web

    # Extract new files
    echo "Extracting files..."
    echo '$SUDO_PASSWORD' | sudo -S tar -xzf /tmp/reportify-web.tar.gz -C /var/www/reportify-web

    # Set proper permissions
    echo "Setting permissions..."
    echo '$SUDO_PASSWORD' | sudo -S chown -R www-data:www-data /var/www/reportify-web
    echo '$SUDO_PASSWORD' | sudo -S chmod -R 755 /var/www/reportify-web

    # Clean up
    rm /tmp/reportify-web.tar.gz

    # Reload nginx
    echo "Reloading nginx..."
    echo '$SUDO_PASSWORD' | sudo -S systemctl reload nginx

    echo "Deployment completed on server!"
ENDSSH

# Step 5: Clean up local files
echo -e "${BLUE}Cleaning up local files...${NC}"
rm reportify-web.tar.gz

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Application is now live at: https://${SSH_HOST}${NC}"
