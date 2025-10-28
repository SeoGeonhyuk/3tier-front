# syntax=docker/dockerfile:1.4
# React 프론트엔드 애플리케이션을 위한 Dockerfile (Multi-stage Build with BuildKit Cache)

# Build argument for cache registry
ARG CACHE_REGISTRY
ARG PUBLIC_URL

# Stage 1: Dependencies - 의존성 설치 레이어 (캐싱 최적화)
FROM node:20-alpine3.21 AS dependencies

# 보안 업데이트 적용
RUN apk upgrade --no-cache

# Non-root 사용자 생성
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# 디렉토리 소유권 변경
RUN chown -R nodejs:nodejs /app

# Non-root 사용자로 전환
USER nodejs

# package.json과 yarn.lock만 먼저 복사 (캐시 효율성)
COPY --chown=nodejs:nodejs package.json yarn.lock ./

# BuildKit 캐시 마운트를 사용한 의존성 설치
RUN --mount=type=cache,target=/home/nodejs/.yarn,sharing=locked,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/.yarn/cache,sharing=locked,uid=1001,gid=1001 \
    yarn install --frozen-lockfile

# Stage 2: Test - devDependencies 포함하여 테스트 실행
FROM dependencies AS tester

# 애플리케이션 소스 복사
COPY --chown=nodejs:nodejs . .

# 테스트 실행 (테스트가 실패하면 빌드 중단)
RUN --mount=type=cache,target=/home/nodejs/.yarn,sharing=locked,uid=1001,gid=1001 \
    yarn test

# Stage 3: Builder - 프로덕션 빌드 생성
FROM dependencies AS builder

# Build arguments를 환경변수로 전달
ARG PUBLIC_URL
ENV PUBLIC_URL=${PUBLIC_URL}

# 애플리케이션 소스 복사
COPY --chown=nodejs:nodejs . .

# BuildKit 캐시 마운트를 사용한 프로덕션 빌드
RUN --mount=type=cache,target=/home/nodejs/.yarn,sharing=locked,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/.yarn/cache,sharing=locked,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/node_modules/.cache,sharing=locked,uid=1001,gid=1001 \
    yarn build

# Stage 4: Production - Nginx로 정적 파일 서빙
FROM nginx:alpine AS production

# 보안 업데이트 적용
RUN apk upgrade --no-cache

# Nginx 사용자 권한 설정을 위한 디렉토리 준비
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /usr/share/nginx/html

# Nginx 설정 파일 복사 (선택사항)
# COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일을 Nginx의 기본 서빙 디렉토리로 복사
COPY --from=builder --chown=nginx:nginx /app/build /usr/share/nginx/html

# Non-root 사용자로 전환
USER nginx

# 포트 노출
EXPOSE 80

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
