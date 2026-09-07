# syntax=docker/dockerfile:1
# Next.js 16 (standalone) — untuk VPS + Docker.
# sharp & @libsql/client punya binary native → pakai debian slim (glibc).

FROM node:24-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1

# ── deps ──────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── build ─────────────────────────────────────────────────────
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# .env.local tidak ikut (lihat .dockerignore) — env dikirim saat runtime
RUN npm run build

# ── runner ────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN groupadd -r nodejs && useradd -r -g nodejs nextjs \
  && mkdir -p /app/.data && chown -R nextjs:nodejs /app/.data

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
# untuk `npm run db:migrate` di dalam container (deploy step)
COPY --from=build /app/lib/db/migrations ./lib/db/migrations
COPY --from=build /app/scripts/db-migrate.ts ./scripts/db-migrate.ts
COPY --from=build /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --from=build /app/node_modules/@libsql ./node_modules/@libsql

USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
