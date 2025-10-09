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

def normalize_datetime(dt: datetime):
    return int(dt.timestamp())


def poll_commands(
    device: CrowdPadController, start_time: datetime, aggregation_interval: int, polling_interval: int, lag: int
) -> None:
    """Polls the server for commands and executes them."""
    if not SERVER_SECRET:
        print("SERVER_SECRET environment variable not set.")
        return

    url = f"{SERVER_URI}/commands"
    print(f"Polling for commands from {url} every {polling_interval}ms with a lag of {lag}ms")
    last_timestamp = start_time - timedelta(milliseconds=lag)

    while True:
        end_time = last_timestamp + timedelta(milliseconds=polling_interval)
        print(f"Getting commands between {normalize_datetime(last_timestamp)} - {normalize_datetime(end_time)}")
        try:
            response = requests.get(
                url,
                params={
                    "startTime": normalize_datetime(last_timestamp),
                    "endTime": normalize_datetime(end_time),
                },
                headers={"Authorization": f"Bearer {SERVER_SECRET}"},
            )

            if response.status_code == 200:
                commands = [GameInput.model_validate(c) for c in response.json()]
                if commands:
                    segment_start_time = last_timestamp
                    while segment_start_time < end_time:
                        segment_end_time = segment_start_time + timedelta(milliseconds=aggregation_interval)
                        formatted_degment_start_time = normalize_datetime(segment_start_time)
                        formatted_degment_end_time = normalize_datetime(segment_end_time)
                        segment_commands = [c for c in commands if formatted_degment_start_time <= c.timestamp < formatted_degment_end_time]

                        if segment_commands:
                            # We got inputs in the interval
                            frequency = {}
                            for c in segment_commands:
                                frequency[c.command] = frequency.get(c.command, 0) + 1

                            most_popular_command = max(frequency, key=frequency.get)

                            frequency_str = ""
                            for c, count in frequency.items():
                                frequency_str+=f"{c}: {count}, "
                            print(f"--- Command Report {formatted_degment_start_time} - {formatted_degment_end_time} ---")
                            print(f"Gotten: {frequency_str.strip()}")
                            print(f"Picked: {most_popular_command}")
                            print("----------------------")

                            device.press_button(most_popular_command)
                        else:
                            print(f"No commands between {formatted_degment_start_time} - {formatted_degment_end_time}")

                        segment_start_time = segment_end_time

                last_timestamp = end_time
            elif response.status_code == 401:
                print("Unauthorized. Please check your secret key.")
                break
            else:
                print(f"Error polling commands: {response.status_code} {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"Connection to {SERVER_URI} failed: {e}")

        time.sleep(polling_interval / 1000)


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
@click.option(
    "--pollingInterval",
    default=2000,
    help="How frequently to poll commands from server.",
)
@click.option(
    "--lag",
    default=1000,
    help="Lag for allowing write ops to the db.",
)
def listen(startfromtimestamp, aggregationinterval, pollinginterval, lag):
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

        poll_commands(controller, start_time, aggregation_interval=aggregationinterval, polling_interval=pollinginterval, lag = lag)
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
