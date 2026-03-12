from pydantic import BaseModel
from typing import List
from policy import Policy

class Manifesto(BaseModel):
    party_name: str
    election_year: int
    region: str
    source_url: str
    policies: List[Policy]