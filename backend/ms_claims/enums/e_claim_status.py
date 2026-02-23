from enum import Enum

class ClaimStatus(str, Enum):
    draft = "draft"
    submitted = "submitted"
    reviewed = "reviewed"
    approved = "approved"
    rejected = "rejected"
