"""create_activity_logs_table

Revision ID: c9e4a07c4e56
Revises: 047e17e87e8e
Create Date: 2026-02-17 17:43:46.594542

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c9e4a07c4e56'
down_revision: Union[str, Sequence[str], None] = '047e17e87e8e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "activity_logs",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("entity", sa.String),
        sa.Column("entity_id", sa.Integer),
        sa.Column("from_status", sa.String),
        sa.Column("to_status", sa.String),
        sa.Column("actor_role", sa.String),
        sa.Column("timestamp", sa.DateTime, server_default=sa.func.now()),
    )


def downgrade():
    op.drop_table("activity_logs")