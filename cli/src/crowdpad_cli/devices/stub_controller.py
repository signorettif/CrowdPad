class StubCrowdPadController:
    def __init__(self):
        print("Using stubbed CrowdPad controller; no real inputs will be emitted.")

    def press_button(self, key: str, duration: float = 0.1) -> None:
        print(f"[stub] press_button called with key={key} duration={duration}")
