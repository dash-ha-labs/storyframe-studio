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

# Separate website community service: no Studio workspace or app data.
FROM node:22-alpine AS community
WORKDIR /app
COPY --from=build /app/services/community/ ./services/community/
COPY --from=build /app/apps/website/dist/ ./website/
ENV HOST=0.0.0.0 PORT=9183 COMMUNITY_DB=/data/community.sqlite WEBSITE_DIR=/app/website COOKIE_SECURE=1 TRUST_PROXY=1 COMMUNITY_ORIGINS=https://storyframe.yamu.app
RUN mkdir /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 9183
CMD ["node", "services/community/server.mjs"]

# Static website pages and the Studio SPA.
FROM nginx:alpine AS frontend
COPY --from=build /app/apps/website/dist /usr/share/nginx/website
COPY --from=build /app/apps/web/dist /usr/share/nginx/web
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
