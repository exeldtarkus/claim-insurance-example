"""create_user_auth_table

Revision ID: 047e17e87e8e
Revises: 8211bf1ab5cf
Create Date: 2026-02-17 17:43:16.851629

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '047e17e87e8e'
down_revision: Union[str, Sequence[str], None] = '8211bf1ab5cf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    op.create_table(
        "user_auth",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String, unique=True),
        sa.Column("password", sa.String),
        sa.Column("role", sa.String),
    )


def downgrade():
    op.drop_table("user_auth")