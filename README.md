# Foreword

Fork of [Memos](https://github.com/usememos/memos) ❤️ which fixes the following stuff:

- render of assets on the frontend when S3 storage is setup;
  > The environment variable `MEMOS_ASSETS_BASE_URL` can be provided to override the frontend base URL of assets (useful in scenarios where frontend links have a different base URL than the upload URL)
- make the app installable on Desktop too.

# How to

> NOTE: all commands below assume you are in the project's root folder!

## Update fork

1. Update the `upstream`:

   ```sh
   git fetch upstream
   ```

2. Update the `main` branch in `upstream`:

   ```sh
   git checkout main
   git pull upstream main
   ```

3. Rebase the changes:

   ```sh
   git checkout <FEATURE_BRANCH>
   git rebase main
   ```

## Develop

> Following, `<BE_PORT>` AND `<FE_PORT>` are just placeholders. Use whenever ports you like for each (but obviously different among them).

1. (Optional) If you want to change BE (default 8081) and FE (default 3001) ports, change the [vite.config.mts](/web/vite.config.mts) as follows:

- Update the `devProxyServer`'s port with `<BE_PORT>`
- Update the `config.server.port` to `<FE_PORT>`

2. In a shell window, launch the backend:

   ```
   sh scripts/build.sh && MEMOS_PORT=<BE_PORT> ./build/memos
   ```

3. In another shell window, launch the frontend:

   ```
   cd web && pnpm dev
   ```

## Build

0. Create a `.env` in your production environment with `MEMOS_ASSETS_BASE_URL`; reference the `.env` in a `docker-compose.yml` file.

1. Build the frontend first:

   ```
   cd web && pnpm build
   ```

1. Replace the [backend's frontend dist](/server/router/frontend/dist/) with the [new generated frontend dist folder](/web/dist/)

1. (Optional) If you're going to build an image with same tag as a previously built one:

   ```
   docker rmi <your_organization>/memos:<MEMOS_VERSION>

   docker system prune # NOTE: Read the prompt before confirmation!
   ```

1. Build the app:

   ```
   docker build -f scripts/Dockerfile -t <your_organization>/memos:<MEMOS_VERSION> .
   ```
