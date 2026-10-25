from datetime import UTC, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, field_validator


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
    price: Decimal = Field(gt=Decimal("0"), allow_inf_nan=False)
    currency: str = Field(min_length=1, max_length=3)


class SaleLine(BaseModel):
    """One sold menu item, normalized from a provider's order."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    connection_id: UUID
    restaurant_id: UUID
    order_id: str = Field(min_length=1, max_length=255)
    line_id: str = Field(min_length=1, max_length=255)
    item_id: str = Field(min_length=1, max_length=255)
    item_name: str = Field(min_length=1, max_length=255)
    quantity: Decimal = Field(gt=Decimal("0"), allow_inf_nan=False)
    timestamp: AwareDatetime

    @field_validator("timestamp")
    @classmethod
    def normalize_timestamp(cls, value: datetime) -> datetime:
        return value.astimezone(UTC)


class StockItem(BaseModel):
    """Stock item of POS System"""

    model_config = ConfigDict(frozen=True, extra="forbid")

    connection_id: UUID
    restaurant_id: UUID
    item_id: str = Field(min_length=1, max_length=255)
    item_name: str = Field(min_length=1, max_length=255)
    quantity: Decimal | None = Field(default=None, allow_inf_nan=False)
    is_available: bool | None = None
