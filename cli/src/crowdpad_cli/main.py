import os
import json
import asyncio
from datetime import datetime, timedelta
from collections import deque

import click
import websockets
from dotenv import load_dotenv

from crowdpad_cli.devices.controller import CrowdPadController


load_dotenv()

# SERVER_URI = "ws://localhost:3000/socket"
SERVER_URI = os.environ.get('SERVER_URI')
SERVER_SECRET = os.environ.get('SERVER_SECRET')


def normalize_datetime(dt: datetime):
    return int(dt.timestamp() * 1000)


class InputAggregator:
    def __init__(self, device: CrowdPadController, aggregation_interval: int):
        self.device = device
        self.aggregation_interval = aggregation_interval
        self.inputs = deque()
        self.running = True
        self.window_start = None

    def add_input(self, username: str, input_command: str, timestamp: int):
        """Add an input to the buffer."""
        self.inputs.append(
            {'username': username, 'command': input_command, 'timestamp': timestamp}
        )

    async def process_inputs(self):
        """Process inputs in aggregation intervals."""
        while self.running:
            await asyncio.sleep(0.1)

            if not self.inputs:
                continue

            # Get current time window
            window_start = datetime.fromtimestamp(self.inputs[0]['timestamp'] / 1000)
            window_end = window_start + timedelta(
                milliseconds=self.aggregation_interval
            )

            # Collect inputs within the window
            window_inputs = []
            remaining_inputs = deque()

            for inp in self.inputs:
                if inp['timestamp'] < normalize_datetime(window_end):
                    window_inputs.append(inp)
                else:
                    remaining_inputs.append(inp)

            self.inputs = remaining_inputs
            self.window_start = window_end

            if window_inputs:
                # Aggregate by counting frequency
                frequency = {}
                for inp in window_inputs:
                    cmd = inp['command']
                    frequency[cmd] = frequency.get(cmd, 0) + 1

                # Pick most popular command
                most_popular_command = max(frequency, key=frequency.get)

                # Print report
                frequency_str = ', '.join(
                    [f'{c}: {count}' for c, count in frequency.items()]
                )
                print(
                    f'--- Command Report {normalize_datetime(window_start)} - {normalize_datetime(window_end)} ---'
                )
                print(f'Gotten: {frequency_str}')
                print(f'Picked: {most_popular_command}')
                print('----------------------')

                # Execute command
                self.device.press_button(most_popular_command)
            else:
                print(
                    f'No inputs in {normalize_datetime(window_start)} - {normalize_datetime(window_end)} ---'
                )

    def stop(self):
        """Stop processing."""
        self.running = False


async def listen_websocket(
    device: CrowdPadController, aggregation_interval: int
) -> None:
    """Connect to WebSocket server and listen for input events."""
    if not SERVER_SECRET:
        print('SERVER_SECRET environment variable not set.')
        return

    aggregator = InputAggregator(device, aggregation_interval)

    print(f'Connecting to WebSocket server at {SERVER_URI}...')
    print(f'Aggregation interval: {aggregation_interval}ms')

    try:
        async with websockets.connect(SERVER_URI) as websocket:
            print(f'Connected to WebSocket server at {SERVER_URI}')

            # Send authentication message
            auth_message = {'type': 'auth', 'data': {'secretKey': SERVER_SECRET}}
            await websocket.send(json.dumps(auth_message))
            print('Sent authentication request')

            # Start aggregation task
            aggregation_task = asyncio.create_task(aggregator.process_inputs())

            try:
                # Listen for messages
                async for message in websocket:
                    try:
                        data = json.loads(message)
                        msg_type = data.get('type')

                        if msg_type == 'auth_status':
                            authenticated = data.get('data', {}).get(
                                'authenticated', False
                            )
                            if authenticated:
                                print('Successfully authenticated to WebSocket server')
                            else:
                                print('Authentication failed')
                                break

                        elif msg_type == 'input':
                            # Receive input from server
                            input_data = data.get('data', {})
                            username = input_data.get('username')
                            input_command = input_data.get('input')
                            timestamp = input_data.get('timestamp')

                            if username and input_command and timestamp:
                                aggregator.add_input(username, input_command, timestamp)

                    except json.JSONDecodeError as e:
                        print(f'Failed to parse message: {e}')

            finally:
                # Clean up aggregation task
                aggregator.stop()
                aggregation_task.cancel()
                try:
                    await aggregation_task
                except asyncio.CancelledError:
                    pass

    except websockets.exceptions.WebSocketException as e:
        print(f'WebSocket error: {e}')
    except Exception as e:
        print(f'Connection error: {e}')


@click.group()
def cli():
    """A CLI to control a virtual GBA joystick."""
    pass


@cli.command()
@click.option(
    '--aggregationInterval',
    default=100,
    help='The interval in milliseconds to aggregate commands.',
)
@click.option(
    '--stubController',
    is_flag=True,
    default=False,
    help='Use a stubbed implementation to simulate inputs',
)
def listen(aggregationinterval, stubcontroller):
    """Listen for inputs from the WebSocket server."""
    try:
        controller = CrowdPadController(stub_controller=stubcontroller)
        controller = CrowdPadController()
        print('GBA joystick created. Waiting for inputs...')

        asyncio.run(
            listen_websocket(controller, aggregation_interval=aggregationinterval)
        )
    except KeyboardInterrupt:
        print('\nShutting down...')
    except Exception as e:
        print(f'Failed to create device: {e}')
        print('Please check your permissions.')


@cli.command()
@click.option(
    '--delay', default=0, help='Delay in milliseconds before sending the input.'
)
def manual(delay):
    """Manually send inputs to the virtual joystick."""
    try:
        controller = CrowdPadController()
        print('GBA joystick created. Ready for manual input.')
        print("Type 'exit' to quit.")

        while True:
            input_key = input('> ')
            if input_key == 'exit':
                break

            if delay > 0:
                import time

                time.sleep(delay / 1000)

            controller.press_button(input_key)

    except Exception as e:
        print(f'Failed to create device: {e}')
        print('Please check your permissions.')


if __name__ == '__main__':
    cli()
