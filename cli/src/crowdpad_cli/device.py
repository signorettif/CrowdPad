import uinput
import time
from typing import Tuple, Dict

_BUTTON_MAP: Dict[str, Tuple] = {
    "a": uinput.BTN_A,
    "b": uinput.BTN_B,
    "select": uinput.BTN_SELECT,
    "start": uinput.BTN_START,
    "left": uinput.BTN_DPAD_LEFT,
    "right": uinput.BTN_DPAD_RIGHT,
    "up": uinput.BTN_DPAD_UP,
    "down": uinput.BTN_DPAD_DOWN
}

class CrowdPadController:


    def __init__(self):
        events = tuple(_BUTTON_MAP.values())
        self.device = uinput.Device(
            events,
            name="CrowdPad-Virtual-Joystick"
        )

    def press_button(self, key: str, duration: float = 0.1) -> None:
        button = _BUTTON_MAP.get(key)

        if not button:
            print('[press_button] Button not supported, key should one of ' + _BUTTON_MAP.keys())
            return

        self.device.emit(button, 1)
        time.sleep(duration)
        self.device.emit(button, 0)
    
    def get_available_buttons():
        return _BUTTON_MAP.keys()