from pydantic import BaseModel


class GameInput(BaseModel):
    username: str
    input: str
    timestamp: int
