import sys
from typing import Protocol

from crowdpad_cli.devices.linux_controller import LinuxCrowdPadController
from crowdpad_cli.devices.stub_controller import StubCrowdPadController


class _CrowdPadControllerProtocol(Protocol):
    def press_button(self, key: str, duration: float = 0.1) -> None: ...


def CrowdPadController(stub_controller: bool = False) -> _CrowdPadControllerProtocol:
    """Factory for a CrowdPad controller.

    - If stub_controller is True, return the stub implementation.
    - If platform is not Linux, log and return the stub implementation.
    - Otherwise, return the Linux implementation.
    """
    if stub_controller:
        return StubCrowdPadController()

    if not sys.platform.startswith('linux'):
        print(
            f'Non-Linux platform detected: {sys.platform}. Using stubbed controller instead of the Linux controller.',
        )
        return StubCrowdPadController()

    return LinuxCrowdPadController()
