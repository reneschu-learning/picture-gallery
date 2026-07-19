# Picture Gallery Frontend v2.0.1

This frontend is a React + TypeScript app built with Vite and served by a Node runtime server.
Unlike the previous static Nginx runtime, runtime values are now read on demand from the container environment and local files by the frontend server.

## Runtime architecture

- Client application: React SPA
- Runtime server: Node + Express
- Static asset build: Vite output in dist/
- Frontend runtime API:
  - GET /api/runtime-config
  - POST /api/visit-log

The client reads runtime values from /api/runtime-config instead of window-injected startup scripts.

## Environment variables

- CONFIG_VAR1
- SECRET1
- CONFIG_FILE
- CONFIG_FILE_VOL
- BACKEND_SERVICE

Behavior notes:

- CONFIG_FILE content is read directly by the frontend server from container filesystem.
- CONFIG_FILE_VOL content is resolved by calling BACKEND_SERVICE/getContent?path=<CONFIG_FILE_VOL>.
- If BACKEND_SERVICE is missing, CONFIG_FILE_VOL content is returned as ERROR: Backend not configured.
- If BACKEND_SERVICE is unreachable, CONFIG_FILE_VOL content is returned as ERROR: Backend not reachable.

## Page visit logging

Each route visit sends page metadata to POST /api/visit-log with:

- current timestamp
- browser user agent
- logical page name

The frontend server forwards this as a log string to BACKEND_SERVICE/log when BACKEND_SERVICE is configured.
If BACKEND_SERVICE is missing, no backend log request is made.
If backend logging fails, the error is intentionally ignored.

## Development

Install dependencies:

```sh
npm ci
```

Run development mode:

```sh
npm run dev
```

Run tests:

```sh
npm run test
```

Create production build:

```sh
npm run build
```

Run production server locally (after build):

```sh
npm run start
```

## Docker image builds

Build multi-arch images with Buildx:

```sh
docker buildx bake
```

Build and push with a custom repository:

```sh
docker buildx bake --set *.output=type=registry IMAGE_NAME=ghcr.io/your-org/picture-gallery
```
