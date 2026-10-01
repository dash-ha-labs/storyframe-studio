# Build stage: install deps (cached while package*.json are unchanged), then build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/website/package*.json ./apps/website/
COPY packages/core/package*.json ./packages/core/
COPY packages/tokens/package*.json ./packages/tokens/
COPY packages/ui/package*.json ./packages/ui/
RUN npm ci
COPY . .
RUN npm run build

# Serve stage: static files via nginx with SPA fallback
FROM nginx:alpine
COPY --from=build /app/apps/website/dist /usr/share/nginx/website
COPY --from=build /app/apps/web/dist /usr/share/nginx/web

RUN printf 'server {\n\
    listen 80 default_server;\n\
    server_name storyframe.yamu.app;\n\
    root /usr/share/nginx/website;\n\
    index index.html;\n\
    location / { try_files $uri $uri/ /index.html; }\n\
}\n\
server {\n\
    listen 80;\n\
    server_name studio.storyframe.yamu.app;\n\
    root /usr/share/nginx/web;\n\
    index index.html;\n\
    location / { try_files $uri $uri/ /index.html; }\n\
}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
