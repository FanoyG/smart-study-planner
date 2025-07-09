import os
import json
from moviepy.video.io.VideoFileClip import VideoFileClip
from datetime import timedelta
from pathlib import Path
import argparse

VIDEO_EXTENSIONS = ('.mp4', '.mkv', '.avi', '.mov')

def get_video_duration(file_path):
    try:
        clip = VideoFileClip(str(file_path))
        duration = clip.duration
        clip.close()
        return duration
    except Exception as e:
        print(f"⚠️ Error processing {file_path}: {e}")
        return 0

def format_time(seconds):
    return str(timedelta(seconds=int(seconds)))

def scan_videos(directory):
    video_metadata = []

    for root, _, files in os.walk(directory):
        folder_name = os.path.basename(root)

        for file in files:
            if file.lower().endswith(VIDEO_EXTENSIONS):
                file_path = Path(root) / file
                duration = get_video_duration(file_path)

                video_metadata.append({
                    "title": file,
                    "folder": folder_name,
                    "duration_seconds": int(duration),
                    "duration_formatted": format_time(duration)
                })

    return video_metadata

def main():
    parser = argparse.ArgumentParser(description="Extract video metadata from a folder.")
    parser.add_argument("folder_path", help="Path to the folder containing videos")
    parser.add_argument("--output", default="video_metadata.json", help="Output JSON file name")

    args = parser.parse_args()
    path = Path(args.folder_path).resolve(strict=False)

    if not path.exists() or not path.is_dir():
        print("❌ Invalid folder path")
        return

    print(f"📂 Scanning: {path}")
    metadata = scan_videos(str(path))

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)
    
    print(f"\n✅ Metadata saved to {args.output}")
    print(f"📼 Videos Found: {len(metadata)}")

if __name__ == "__main__":
    main()
