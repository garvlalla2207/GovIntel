from pydantic import BaseModel
from typing import List

class ParliamentaryRecord(BaseModel):
    session_name: str
    date: str 
    topic: str
    summary: str
    key_speakers: List[str]
    source_url: str