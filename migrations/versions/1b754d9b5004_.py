"""empty message

Revision ID: 1b754d9b5004
Revises: f76334663dba
Create Date: 2021-07-01 00:51:58.335419

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1b754d9b5004'
down_revision = 'f76334663dba'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('books', 'title',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=255),
               existing_nullable=True)
    op.alter_column('books', 'author',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=255),
               existing_nullable=True)
    op.alter_column('books', 'subject',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=255),
               existing_nullable=True)
    op.alter_column('books', 'year',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=10),
               existing_nullable=True)
    op.alter_column('books', 'publisher',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=255),
               existing_nullable=True)
    op.alter_column('books', 'isbn',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               type_=sa.String(length=255),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('books', 'isbn',
               existing_type=sa.String(length=255),
               type_=postgresql.DOUBLE_PRECISION(precision=53),
               existing_nullable=True)
    op.alter_column('books', 'publisher',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=80),
               existing_nullable=True)
    op.alter_column('books', 'year',
               existing_type=sa.String(length=10),
               type_=sa.VARCHAR(length=80),
               existing_nullable=True)
    op.alter_column('books', 'subject',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=80),
               existing_nullable=True)
    op.alter_column('books', 'author',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=80),
               existing_nullable=True)
    op.alter_column('books', 'title',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=80),
               existing_nullable=True)
    # ### end Alembic commands ###
