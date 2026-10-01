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

# Serve stage: static files via nginx with SPA fallback and MIME types
FROM nginx:alpine
COPY --from=build /app/apps/website/dist /usr/share/nginx/website
COPY --from=build /app/apps/web/dist /usr/share/nginx/web
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
