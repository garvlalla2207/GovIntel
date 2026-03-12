from pydantic import BaseModel
from typing import List

class GovernmentAnnouncement(BaseModel):
    title: str
    date_announced: str
    department: str
    summary: str
    impact_tags: List[str]
    source_url: str