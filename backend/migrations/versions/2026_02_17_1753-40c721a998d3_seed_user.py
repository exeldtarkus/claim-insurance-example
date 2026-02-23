"""seed_user

Revision ID: 40c721a998d3
Revises: 00070dd1868a
Create Date: 2026-02-17 17:53:01.454148

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '40c721a998d3'
down_revision: Union[str, Sequence[str], None] = '00070dd1868a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    conn = op.get_bind()

    users = []

    # === Reviewer ===
    users.append({
        "email": "reviewer@insurance.test",
        "name": "Reviewer User",
        "role": "verifier",
    })

    # === Approver ===
    users.append({
        "email": "approver@insurance.test",
        "name": "Approver User",
        "role": "approver",
    })

    # === 16 User Customer ===
    for i in range(1, 17):
        users.append({
            "email": f"user{i}@customer.test",
            "name": f"User Customer {i}",
            "role": "user",
        })

    conn.execute(
        sa.text(
            """
            INSERT INTO users (email, name, role)
            VALUES (:email, :name, :role)
            """
        ),
        users,
    )


def downgrade():
    conn = op.get_bind()

    conn.execute(
        sa.text(
            """
            DELETE FROM users
            WHERE email LIKE '%@claim.test'
            """
        )
    )