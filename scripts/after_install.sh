#!/bin/bash
set -e

echo "==== AfterInstall: Setting file permissions ===="

# 파일 및 디렉토리 권한 재설정
sudo chown -R ec2-user:nginx /var/www/html
sudo find /var/www/html -type d -exec chmod 755 {} \;
sudo find /var/www/html -type f -exec chmod 644 {} \;

# SELinux 컨텍스트 설정 (Amazon Linux 2)
if command -v getenforce &> /dev/null && [ "$(getenforce)" != "Disabled" ]; then
    echo "Setting SELinux context..."
    sudo chcon -R -t httpd_sys_content_t /var/www/html
fi

echo "==== AfterInstall completed ===="
