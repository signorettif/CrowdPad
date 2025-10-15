# CrowdPad `cli`

The CrowdPad `cli` is a Python daemon that listens for incoming messages from the CrowdPad `server`, aggregates the crowd's input commands within a configurable interval, and then sends the most-voted input to a virtual gamepad device on your local computer. This allows large numbers of users to collaboratively control a game or software by submitting commands through the CrowdPad `app`, with the `cli` handling local input emulation—ideal for events like "Twitch Plays" or crowdsourced gaming experiments.

## Options

| Option                  | Description                                             | Default |
| ----------------------- | ------------------------------------------------------- | ------- |
| `--aggregationInterval` | The interval in milliseconds to aggregate commands.     | `1000`  |
| `--stubController`      | Use a stubbed implementation to simulate inputs (flag). | `False` |
| `--delay`               | Delay in milliseconds before sending the input.         | `0`     |

## Setup

### Ubuntu (tested on `25.04`)

To run the application without requiring `sudo`, you need to grant your user permission to access the `uinput` device.

1.  **Add your user to the `input` group:**

    ```bash
    sudo usermod -aG input $USER
    ```

2.  **Create a udev rule for `uinput`:**

    ```bash
    echo 'KERNEL=="uinput", MODE="0660", GROUP="input"' | sudo tee /etc/udev/rules.d/99-uinput.rules
    ```

3.  **Reload the udev rules:**

    ```bash
    sudo udevadm control --reload-rules
    sudo udevadm trigger
    ```

4.  **Log out and log back in:**
    For the group changes to take effect, you need to log out of your current session and log back in.

After following these steps, you can run the application without `sudo`.

## Contributing

### Configure environment

1. Install `uv` globally (e.g. via [Homebrew](https://brew.sh/)):

   ```bash
   brew install uv
   uv --version
   ```

1. Navigate to the `./cli` directory

1. Create & activate a virtual environment:

   ```bash
   uv venv .venv
   source .venv/bin/activate
   ```

1. Install dependencies:

   ```bash
   uv pip install -e .
   ```

1. Install [Ruff extension](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff) on VSCode / Cursor

1. Clone `.env.example` into `.env` and populate the required keys

### Running the app locally

1. Navigate to the `./cli` directory

1. Activate environment:

   ```bash
   source .venv/bin/activate
   ```

1. Start server:
   ```bash
   uv run start listen
   ```
