"""create_insurance_table

Revision ID: 8118953279b1
Revises: c9e4a07c4e56
Create Date: 2026-02-17 17:44:12.581133

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8118953279b1'
down_revision: Union[str, Sequence[str], None] = 'c9e4a07c4e56'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "claims",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("insurance_id", sa.String, nullable=True),
        sa.Column("total_amount", sa.Float, nullable=True),
        sa.Column("status", sa.String, nullable=False),
        sa.Column("version", sa.Integer, nullable=False, server_default="1"),
    )


def downgrade():
    op.drop_table("claims")