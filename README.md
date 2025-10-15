# CrowdPad

Virtual gamepad controlled by a large crowd.

- [`app`](./app/README.md): main app for users to send commands
- [`server`](./server/README.md): brain of the operation
- [`cli`](./cli/README.md): virtual gamepad

## Contributing

### Initial setup

#### `app`

1. Install `nvm` and set up Node.js/npm globally (e.g. via [Homebrew](https://brew.sh/)):

1. Navigate to the `./app` directory

1. Install dependencies:

   ```bash
   npm install
   ```

1. Install [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) on VSCode / Cursor

1. Clone `.env.example` into `.env` and populate the required keys

#### `server`

1. Install `bun` globally (e.g. via [Homebrew](https://brew.sh/)):

   ```bash
   brew install oven-sh/bun/bun
   ```

1. Navigate to the `./server` directory

1. Install dependencies:

   ```bash
   bun install
   ```

1. Clone `.env.example` into `.env` and populate the required keys

### Running locally

#### `app`

1. Navigate to the `./app` directory

1. Start the app in dev mode:

   ```bash
   npm run dev
   ```

#### `server`

1. Navigate to the `./server` directory

1. Start the server in dev mode:

   ```bash
   bun dev
   ```
