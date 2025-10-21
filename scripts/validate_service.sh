#!/bin/bash
set -e

echo "==== ValidateService: Checking nginx status ===="

# nginx 프로세스 확인
if ! sudo systemctl is-active --quiet nginx; then
    echo "ERROR: nginx is not running!"
    exit 1
fi

echo "nginx is running successfully"

# HTTP 응답 확인 (localhost:80)
echo "Checking HTTP response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80)

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 304 ]; then
    echo "HTTP response OK (Status code: $HTTP_CODE)"
else
    echo "WARNING: Unexpected HTTP status code: $HTTP_CODE"
    # 경고만 출력하고 실패하지 않음 (index.html이 없을 수도 있음)
fi

# 배포된 파일 확인
if [ -f "/var/www/html/index.html" ]; then
    echo "index.html found in /var/www/html"
else
    echo "WARNING: index.html not found in /var/www/html"
fi

echo "==== ValidateService completed ===="
