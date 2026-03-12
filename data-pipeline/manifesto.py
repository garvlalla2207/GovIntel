from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class PolicySector(str, Enum):
    HEALTHCARE = "Healthcare"
    EDUCATION = "Education"
    INFRASTRUCTURE = "Infrastructure"
    ECONOMY = "Economy"
    DEFENSE = "Defense"
    AGRICULTURE = "Agriculture"
    TECHNOLOGY = "Technology"
    SOCIAL_WELFARE = "Social Welfare"
    ENVIRONMENT = "Environment"
    GOVERNANCE = "Governance"
    OTHER = "Other"

class Commitment(BaseModel):
    title: str = Field(description="Short title of the promise.")
    description: str = Field(description="The detailed text of the promise.")
    sector: PolicySector = Field(description="The category this falls under.")
    governance_domain: str = Field(description="The Ministry/Department responsible.")
    is_measurable: bool = Field(description="True if it contains numbers or specific targets.")
    target_metric: Optional[str] = Field(default=None, description="Quantifiable goal.")

class Manifesto(BaseModel):
    party_name: str
    election_year: int
    source_url: str
    commitments: List[Commitment]