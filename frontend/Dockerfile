FROM --platform=$BUILDPLATFORM node:20-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM --platform=$TARGETPLATFORM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
	PORT=80

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs

# Keep compatibility for existing reverse-proxy assumptions by serving on port 80.
EXPOSE 80

CMD ["node", "server.mjs"]
