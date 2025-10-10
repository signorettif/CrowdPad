import logging
import sys
import time
from typing import Dict

# Import uinput only on Linux platforms; otherwise keep as None
try:
    if sys.platform.startswith("linux"):
        import uinput  # type: ignore
    else:
        uinput = None  # type: ignore
except Exception:
    uinput = None  # type: ignore

# Build button map only when uinput is available
_BUTTON_MAP: Dict[str, int] = (
    {
        "a": uinput.BTN_A,
        "b": uinput.BTN_B,
        "select": uinput.BTN_SELECT,
        "start": uinput.BTN_START,
        "left": uinput.BTN_DPAD_LEFT,
        "right": uinput.BTN_DPAD_RIGHT,
        "up": uinput.BTN_DPAD_UP,
        "down": uinput.BTN_DPAD_DOWN,
    }
    if uinput is not None
    else {}
)


class LinuxCrowdPadController:
    def __init__(self):
        if uinput is None:
            raise RuntimeError("LinuxCrowdPadController requires Linux to use 'python-uinput' package.")
        axes = (
            uinput.ABS_X + (-32768, 32767, 0, 0),
            uinput.ABS_Y + (-32768, 32767, 0, 0),
        )

        events = tuple(_BUTTON_MAP.values()) + axes

        self.device = uinput.Device(events, name="CrowdPad-Virtual-Joystick")

    def press_button(self, key: str, duration: float = 0.1) -> None:
        button = _BUTTON_MAP.get(key)

        if not button:
            logging.warning(
                "[press_button] Button not supported, key should be one of %s",
                list(_BUTTON_MAP.keys()),
            )
            return

        self.device.emit(button, 1)
        time.sleep(duration)
        self.device.emit(button, 0)
