# 1. Base Image (로컬 버전과 동일한 v20 사용)
FROM node:20-alpine
WORKDIR /app
# 2. 패키지 파일 먼저 복사 (캐시 효율화)
COPY package*.json ./
# 3. 의존성 설치
# npm ci를 쓰면 package-lock.json과 정확히 일치하게 설치되어 더 안전합니다.
RUN npm install
# 4. 소스 코드 복사
# (.dockerignore 덕분에 node_modules는 복사되지 않음)
COPY . .
# 5. 빌드 (TypeScript -> JavaScript 변환)
RUN npm run build
# 6. 포트 개방
EXPOSE 3000
# 7. 실행
CMD ["node", "dist/main"]