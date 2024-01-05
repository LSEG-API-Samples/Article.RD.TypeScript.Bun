# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
ARG BUN_VERSION=1.0.21
ARG VARIANT=alpine
FROM oven/bun:${BUN_VERSION} as builder
LABEL maintainer="Developer Relations"

# Create app directory
WORKDIR /app

# Install app dependencies and build configurations
COPY package.json .
COPY bun.lockb .
COPY tsconfig.json .

# Copy source
COPY src ./src

# install dependencies (dev and others)
RUN bun install --frozen-lockfile
# Build app
RUN bun run build

## Second stage, for running the application in a final image.

FROM oven/bun:${BUN_VERSION}-${VARIANT} as release

# Create app directory
WORKDIR /app

# Set ENV Production 

ENV NODE_ENV production
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lockb .
COPY --from=builder /app/tsconfig.json .

# install dependencies ith Production flag
RUN bun install --frozen-lockfile --production

# Copy the bundle file and run script
COPY --from=builder /app/dist ./dist

# run the app
ENTRYPOINT [ "bun", "run", "./dist/rdlib_cfsWorkflow.js" ]
