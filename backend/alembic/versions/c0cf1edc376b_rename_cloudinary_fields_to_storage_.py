"""rename cloudinary fields to storage fields

Revision ID: c0cf1edc376b
Revises: 848fab34b346
Create Date: 2026-08-28 23:51:02.369172
"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'c0cf1edc376b'
down_revision: Union[str, Sequence[str], None] = '848fab34b346'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Rename Cloudinary columns to generic storage columns."""

    op.alter_column(
        'documents',
        'cloudinary_public_id',
        new_column_name='storage_key'
    )

    op.alter_column(
        'documents',
        'cloudinary_url',
        new_column_name='storage_url'
    )


def downgrade() -> None:
    """Rename storage columns back to Cloudinary columns."""

    op.alter_column(
        'documents',
        'storage_key',
        new_column_name='cloudinary_public_id'
    )

    op.alter_column(
        'documents',
        'storage_url',
        new_column_name='cloudinary_url'
    )