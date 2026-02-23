import sys
from pathlib import Path
from logging.config import fileConfig

# ===== Third-party =====
from sqlalchemy import engine_from_config, pool
from alembic import context

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from core.config import settings
from core.database import Base

from ms_auth.models.user_auth_model import UserAuth
from ms_claims.models.claim_model import Claim
from ms_activity_logs.models.activity_logs_model import ActivityLog
from ms_users.models.user_model import User

# ------------------------------------------------------------------

config = context.config
fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_url() -> str:
    return settings.DATABASE_URL


def run_migrations_offline() -> None:
    context.configure(
        url=get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        url=get_url(),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
