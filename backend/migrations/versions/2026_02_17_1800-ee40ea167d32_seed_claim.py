"""seed_claim

Revision ID: ee40ea167d32
Revises: 1a68332a8424
Create Date: 2026-02-17 18:00:27.957150

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import random


# revision identifiers, used by Alembic.
revision: str = 'ee40ea167d32'
down_revision: Union[str, Sequence[str], None] = '1a68332a8424'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


CLAIM_STATUSES = [
    "draft",
    "draft",
    "draft",
    "submitted",
    "reviewed",
    "approved",
    "rejected",
]


def upgrade():
    conn = op.get_bind()

    # ambil 10 insurance uuid
    insurance_rows = conn.execute(
        sa.text(
            """
            SELECT uuid, amount, user_id
            FROM insurance
            ORDER BY id
            LIMIT 10
            """
        )
    ).fetchall()

    claims = []

    for ins in insurance_rows:
        status = random.choice(CLAIM_STATUSES)
        version = {
            "draft": 1,
            "submitted": 2,
            "reviewed": 3,
            "approved": 4,
            "rejected": 4,
        }[status]

        claims.append(
            {
                "user_id": ins.user_id,
                "insurance_id": ins.uuid,
                "total_amount": ins.amount,
                "status": status,
                "version": version,
            }
        )

    conn.execute(
        sa.text(
            """
            INSERT INTO claims (
                user_id,
                insurance_id,
                total_amount,
                status,
                version
            )
            VALUES (
                :user_id,
                :insurance_id,
                :total_amount,
                :status,
                :version
            )
            """
        ),
        claims,
    )


def downgrade():
    conn = op.get_bind()

    conn.execute(
        sa.text(
            """
            DELETE FROM claims
            WHERE insurance_id IN (
                SELECT uuid FROM insurance ORDER BY id LIMIT 10
            )
            """
        )
    )
