"""seed_insurance

Revision ID: 1a68332a8424
Revises: a2f7e87bb1ec
Create Date: 2026-02-17 17:56:53.292917

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import uuid
import random


# revision identifiers, used by Alembic.
revision: str = '1a68332a8424'
down_revision: Union[str, Sequence[str], None] = 'a2f7e87bb1ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

INSURANCE_TYPES = [
    "kesehatan",
    "jiwa",
    "pendidikan",
    "kendaraan",
    "properti",
]


def upgrade():
    conn = op.get_bind()

    insurances = []

    for i in range(15):
        insurances.append(
            {
                "uuid": str(uuid.uuid4()),
                "user_id": random.randint(1, 18),
                "amount": round(random.uniform(5_000_000, 500_000_000), 2),
                "insurance_type": random.choice(INSURANCE_TYPES),
                "desc": f"Insurance seed data #{i+1}",
            }
        )

    conn.execute(
        sa.text(
            """
            INSERT INTO insurance (
                uuid,
                user_id,
                amount,
                insurance_type,
                "desc"
            )
            VALUES (
                :uuid,
                :user_id,
                :amount,
                :insurance_type,
                :desc
            )
            """
        ),
        insurances,
    )


def downgrade():
    conn = op.get_bind()

    conn.execute(
        sa.text(
            """
            DELETE FROM insurance
            WHERE "desc" LIKE 'Insurance seed data%'
            """
        )
    )