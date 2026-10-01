# Build stage: install deps (cached while package*.json are unchanged), then build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage: static files via nginx with SPA fallback
FROM nginx:alpine
RUN apk add --no-cache apache2-utils && \
    htpasswd -cb /etc/nginx/.htpasswd admin secret && \
    printf 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { auth_basic "Private"; auth_basic_user_file /etc/nginx/.htpasswd; try_files $uri $uri/ /index.html; } }\n' > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
