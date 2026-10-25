from datetime import UTC, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import AwareDateTime, BaseModel, CondigDict, Field, field_validator

class PosConnection(BaseModel):
    """Connection to a POS locaiton"""

    model_config = ConfigDict(frozen=True, extra="forbid")

    id: UUID
    restaurant_id: UUID
    provider: str = Field(min_length=1, max_length=255)
    location_id: str = Field(min_length=1, max_length=255)

class MenuItem(BaseModel):
    """Meny item of POS System"""

    model_config = ConfigDict(frozen=True, extra="forbid")

    connection_id: UUID
    restaurant_id: UUID
    item_id: str = Field(min_length=1, max_length=255)
    item_name: str = Field(min_length=1, max_length=255)

class SaleLine(BaseModel):
    """Sale line item of POS System"""

    connection_id: UUID
    restaurant_id: UUID
    order_id: str = Field(min_length=1, max_length=255)
    line_id: str = Field(min_length=1, max_length=255)
    item_id: str = Field(min_length=1, max_length=255)
    item_name: str = Field(min_length=1, max_length=255)
    quantity: Decimal = Field(gt=Decimal("0"), allow_inf_nan=False)
    timestamp: AwareDateTime