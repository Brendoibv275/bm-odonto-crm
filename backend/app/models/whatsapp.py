from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WhatsAppMessage(BaseModel):
    from_number: str
    message: str
    timestamp: Optional[datetime] = None

class WhatsAppResponse(BaseModel):
    to_number: str
    message: str
    timestamp: Optional[datetime] = None 