"""seed_aut_user

Revision ID: a2f7e87bb1ec
Revises: 40c721a998d3
Create Date: 2026-02-17 17:53:29.271936

"""
from typing import Sequence, Union

from alembic import op
from passlib.context import CryptContext
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a2f7e87bb1ec'
down_revision: Union[str, Sequence[str], None] = '40c721a998d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)

PASSWORD_HASH = pwd_context.hash("password123")

def upgrade():
    conn = op.get_bind()

    auth_users = []

    # reviewer
    auth_users.append({
        "email": "reviewer@insurance.test",
        "password": PASSWORD_HASH,
        "role": "verifier",
    })

    # approver
    auth_users.append({
        "email": "approver@insurance.test",
        "password": PASSWORD_HASH,
        "role": "approver",
    })

    # user customers
    for i in range(1, 17):
        auth_users.append({
            "email": f"user{i}@customer.test",
            "password": PASSWORD_HASH,
            "role": "user",
        })

    conn.execute(
        sa.text(
            """
            INSERT INTO user_auth (email, password, role)
            VALUES (:email, :password, :role)
            """
        ),
        auth_users,
    )


def downgrade():
    conn = op.get_bind()

    conn.execute(
        sa.text(
            """
            DELETE FROM user_auth
            WHERE email LIKE '%@claim.test'
            """
        )
    )