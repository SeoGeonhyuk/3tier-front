#!/bin/bash
set -e

echo "==== BeforeInstall: Preparing deployment directory ===="

# /var/www/html 디렉토리 확인 및 생성
if [ -d "/var/www/html" ]; then
    echo "Directory /var/www/html exists. Cleaning up old files..."
    sudo rm -rf /var/www/html/*
else
    echo "Directory /var/www/html does not exist. Creating..."
    sudo mkdir -p /var/www/html
fi

# 디렉토리 권한 설정
sudo chown -R ec2-user:nginx /var/www/html
sudo chmod 755 /var/www/html

echo "==== BeforeInstall completed ===="
