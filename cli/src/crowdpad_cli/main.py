import asyncio
import json
import time

import click
import uinput
import websockets

from crowdpad_cli.device import CrowdPadController

SERVER_URL = "wss://crowdpad-server.fly.dev/socket"
# SERVER_URL = "ws://localhost:3000/socket"
SECRET_KEY = "supersecretkey"


async def listen_async(device: uinput.Device) -> None:
    """Listens for websocket events and controls the virtual device."""
    print(f"Connecting to {SERVER_URL}")
    try:
        async with websockets.connect(SERVER_URL) as websocket:
            print("Connected to server")

            # Authenticate
            await websocket.send(
                json.dumps({"type": "auth", "data": {"secretKey": SECRET_KEY}})
            )

            # Join
            await websocket.send(json.dumps({"type": "join"}))

            async for message in websocket:
                try:
                    data = json.loads(message)
                    if data.get("type") == "input":
                        input_key = data.get("data", {}).get("input")
                        if not input_key:
                            continue

                        print(f"Received input: {input_key}")
                        

                except json.JSONDecodeError:
                    print(f"Could not decode message: {message}")
                except Exception as e:
                    print(f"An error occurred: {e}")
    except (websockets.exceptions.ConnectionClosedError, ConnectionRefusedError) as e:
        print(f"Connection to {SERVER_URL} failed: {e}")
        print("Retrying in 5 seconds...")
        await asyncio.sleep(5)
        await listen_async(device)


@click.group()
def cli():
    """A CLI to control a virtual GBA joystick."""
    pass


@cli.command()
def listen():
    """Listen for inputs from the websocket server."""
    try:
        controller = CrowdPadController()
        print("GBA joystick created. Waiting for inputs...")
        asyncio.run(listen_async(controller.device))
    except Exception as e:
        print(f"Failed to create device: {e}")
        print("Please check your permissions.")


@cli.command()
@click.option('--delay', default=0, help='Delay in milliseconds before sending the input.')
def manual(delay):
    """Manually send inputs to the virtual joystick."""
    try:
        controller = CrowdPadController()
        print("GBA joystick created. Ready for manual input.")
        # print("Available buttons: ", ", ".join(controller.get_available_buttons()))
        print("Type 'exit' to quit.")

        while True:
            input_key = input("> ")
            if input_key == "exit":
                break

            if delay > 0:
                time.sleep(delay / 1000)
            
            controller.press_button(input_key)
            

    except Exception as e:
        print(f"Failed to create device: {e}")
        print("Please check your permissions.")


if __name__ == "__main__":
    cli()
