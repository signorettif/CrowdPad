import os
import time
from datetime import datetime, timedelta

import click
import requests
from dotenv import load_dotenv

from crowdpad_cli.device import CrowdPadController
from crowdpad_cli.models.game_input import GameInput

load_dotenv()

SERVER_URI = os.environ.get("SERVER_URI")
SERVER_SECRET = os.environ.get("SERVER_SECRET")


def poll_commands(
    device: CrowdPadController, start_time: datetime, interval: int
) -> None:
    """Polls the server for commands and executes them."""
    if not SERVER_SECRET:
        print("SERVER_SECRET environment variable not set.")
        return

    url = f"{SERVER_URI}/commands"
    print(f"Polling for commands from {url}")
    last_timestamp = start_time

    while True:
        try:
            end_time = last_timestamp + timedelta(milliseconds=interval)
            response = requests.get(
                url,
                params={
                    "startTime": int(last_timestamp.timestamp() * 1000),
                    "endTime": int(end_time.timestamp() * 1000),
                },
                headers={"Authorization": f"Bearer {SERVER_SECRET}"},
            )

            if response.status_code == 200:
                commands = [GameInput.model_validate(c) for c in response.json()]
                if commands:
                    frequency = {}
                    for command in commands:
                        frequency[command.input] = frequency.get(command.input, 0) + 1

                    most_popular_command = max(frequency, key=frequency.get)

                    # We got inputs in the interval
                    frequency_str = ""
                    for command, count in frequency.items():
                        frequency_str+=f"{command}: {count}, "
                    print(f"--- Command Report {last_timestamp.isoformat()} - {end_time.isoformat()} ---")
                    print(f"Gotten: {frequency_str.strip()}")
                    print(f"Picked: {most_popular_command}")
                    print("----------------------")

                    device.press_button(most_popular_command)
                else:
                    print(f"No commands between {last_timestamp.isoformat()} - {end_time.isoformat()}")

                last_timestamp = end_time
            elif response.status_code == 401:
                print("Unauthorized. Please check your secret key.")
                break
            else:
                print(f"Error polling commands: {response.status_code} {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"Connection to {SERVER_URI} failed: {e}")

        time.sleep(interval / 1000)


@click.group()
def cli():
    """A CLI to control a virtual GBA joystick."""
    pass


@cli.command()
@click.option(
    "--startFromTimestamp",
    default=None,
    help="The start time to poll commands from (YYYY-MM-DDTHH:MM:SS or epoch time in milliseconds). Defaults to now.",
)
@click.option(
    "--aggregationInterval",
    default=100,
    help="The interval in milliseconds to aggregate commands.",
)
def listen(startfromtimestamp, aggregationinterval):
    """Listen for inputs from the server."""
    try:
        controller = CrowdPadController()
        print("GBA joystick created. Waiting for inputs...")

        if startfromtimestamp:
            if startfromtimestamp.isdigit():
                start_time = datetime.fromtimestamp(int(startfromtimestamp) / 1000)
            else:
                start_time = datetime.fromisoformat(startfromtimestamp)
        else:
            start_time = datetime.now()

        poll_commands(controller, start_time, aggregationinterval)
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
