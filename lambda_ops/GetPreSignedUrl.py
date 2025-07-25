import boto3
import os
import uuid

s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Extract filename from event
    file_content = event['body']  # Assuming base64-encoded binary
    filename = event['headers'].get('filename', f"video-{uuid.uuid4()}.mp4")

    # Create bucket if not exists
    bucket_name = "input-s3-bucket-smart-planner"
    region = os.environ.get("AWS_REGION", "ap-south-1")

    try:
        s3.head_bucket(Bucket=bucket_name)
    except:
        s3.create_bucket(Bucket=bucket_name, CreateBucketConfiguration={"LocationConstraint": region})

    # Upload video to S3
    s3.put_object(
        Bucket=bucket_name,
        Key=filename,
        Body=bytes(file_content, 'utf-8'),  # Or decode if base64
    )

    return {
        'statusCode': 200,
        'body': f"Video uploaded to bucket {bucket_name}/{filename}"
    }
