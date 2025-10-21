#!/bin/bash
set -e

echo "==== ApplicationStart: Restarting nginx ===="

# nginx 서비스 재시작
if sudo systemctl is-active --quiet nginx; then
    echo "Restarting nginx service..."
    sudo systemctl restart nginx
else
    echo "Starting nginx service..."
    sudo systemctl start nginx
fi

# nginx 서비스 enable (부팅 시 자동 시작)
sudo systemctl enable nginx

echo "==== ApplicationStart completed ===="
