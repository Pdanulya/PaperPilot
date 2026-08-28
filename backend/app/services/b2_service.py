import boto3

from app.core.config import (
    B2_ENDPOINT_URL,
    B2_ACCESS_KEY_ID,
    B2_SECRET_ACCESS_KEY,
    B2_BUCKET_NAME,
    B2_REGION
)


b2_client = boto3.client(
    "s3",
    endpoint_url=B2_ENDPOINT_URL,
    aws_access_key_id=B2_ACCESS_KEY_ID,
    aws_secret_access_key=B2_SECRET_ACCESS_KEY,
    region_name=B2_REGION
)


def upload_document_to_b2(
    file_bytes: bytes,
    filename: str,
    user_id: int
) -> dict:

    object_key = (
        f"paperpilot/users/{user_id}/documents/{filename}"
    )

    try:
        b2_client.put_object(
            Bucket=B2_BUCKET_NAME,
            Key=object_key,
            Body=file_bytes
        )

        return {
            "bucket": B2_BUCKET_NAME,
            "key": object_key
        }

    except Exception as e:
        raise Exception(
            f"Backblaze B2 upload failed: {str(e)}"
        )


def delete_document_from_b2(object_key: str):
    try:
        b2_client.delete_object(
            Bucket=B2_BUCKET_NAME,
            Key=object_key
        )

    except Exception as e:
        raise Exception(
            f"Backblaze B2 deletion failed: {str(e)}"
        )