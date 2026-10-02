# Build stage: install deps (cached while package*.json are unchanged), then build
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/website/package*.json ./apps/website/
COPY packages/core/package*.json ./packages/core/
COPY packages/tokens/package*.json ./packages/tokens/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/catalog/package*.json ./packages/catalog/
COPY packages/composition/package*.json ./packages/composition/
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

# Creation/catalog service; 9Router credentials are runtime-only.
FROM node:22-bookworm-slim AS brag
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg chromium ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/packages/ ./packages/
COPY --from=build /app/services/brag/ ./services/brag/
COPY --from=build /app/apps/web/public/demo/ ./apps/web/public/demo/
COPY --from=build /app/apps/website/dist/ ./apps/website/dist/
ENV HOST=0.0.0.0 BRAG_PORT=9184 STUDIO_DB=/data/studio.sqlite COOKIE_SECURE=1 HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium
RUN mkdir /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 9184
CMD ["node", "--import", "tsx", "services/brag/server.mjs"]

# Static website pages and the Studio SPA.
FROM nginx:alpine AS frontend
COPY --from=build /app/apps/website/dist /usr/share/nginx/website
COPY --from=build /app/apps/web/dist /usr/share/nginx/web
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
