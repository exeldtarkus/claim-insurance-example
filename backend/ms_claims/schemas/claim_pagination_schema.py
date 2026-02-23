from typing import Optional
from core.schemas.pagination_query import PaginationQuery

class ClaimQueryParams(PaginationQuery):
    status: Optional[str] = None
    user_id: Optional[int] = None
