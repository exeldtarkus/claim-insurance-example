"""create_claims_table

Revision ID: 00070dd1868a
Revises: 8118953279b1
Create Date: 2026-02-17 17:44:29.307526

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '00070dd1868a'
down_revision: Union[str, Sequence[str], None] = '8118953279b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "insurance",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("uuid", sa.String, nullable=False, unique=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), nullable=False),
        sa.Column("amount", sa.Float, nullable=False),
        sa.Column(
            "insurance_type",
            sa.Enum(
                "kesehatan",
                "jiwa",
                "pendidikan",
                "kendaraan",
                "properti",
                name="insurance_type_enum",
            ),
            nullable=False,
        ),
        sa.Column("desc", sa.Text),
    )


def downgrade():
    op.drop_table("insurance")
    op.execute("DROP TYPE IF EXISTS insurance_type_enum")
