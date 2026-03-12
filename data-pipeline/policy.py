from pydantic import BaseModel, Field
from typing import Optional

class Policy(BaseModel):
    category: str = Field(description="The sector or category, e.g., Healthcare, Economy, Infrastructure")
    title: str = Field(description="The short title of the promise or policy")
    description: str = Field(description="Detailed text of the promise")
    target_completion: Optional[str] = Field(default=None, description="Target year or date if specified, otherwise null")