# Stage 1: Build
FROM node:16-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 yarn.lock 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install --frozen-lockfile

# 애플리케이션 소스 복사
COPY . .

# 프로덕션 빌드 생성
RUN yarn build

# Stage 2: Production
FROM nginx:alpine

# Nginx 설정 파일 복사 (선택사항)
# COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일을 Nginx의 기본 서빙 디렉토리로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
