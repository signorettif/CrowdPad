import time
import uinput

def main():
    # GBA buttons
    events = (
        uinput.BTN_A,
        uinput.BTN_B,
        uinput.BTN_START,
        uinput.BTN_SELECT,
        uinput.ABS_X + (-1, 1, 0, 0),
        uinput.ABS_Y + (-1, 1, 0, 0),
    )

    with uinput.Device(events, name="CrowdPad-Virtual-Joystick") as device:
        print("GBA joystick created")
        # Press A every 2 seconds
        while True:
            device.emit(uinput.BTN_A, 1)  # Press A
            time.sleep(0.1)
            device.emit(uinput.BTN_A, 0)  # Release A
            time.sleep(1.9)

if __name__ == "__main__":
    main()