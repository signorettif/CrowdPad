from pydantic import BaseModel


class GameInput(BaseModel):
    id: int
    username: str
    command: str
    timestamp: int
