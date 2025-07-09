import os
import json
import re
import argparse
from datetime import timedelta
from pathlib import Path
from moviepy.video.io.VideoFileClip import VideoFileClip

VIDEO_EXTENSIONS = ('.mp4', '.mkv', '.avi', '.mov')


def get_video_duration(file_path):
    """Extract video duration in seconds."""
    try:
        clip = VideoFileClip(str(file_path))
        duration = clip.duration
        clip.close()
        return duration
    except Exception as e:
        print(f"⚠️ Error processing {file_path}: {e}")
        return 0


def format_time(seconds):
    """Convert seconds to HH:MM:SS format."""
    return str(timedelta(seconds=int(seconds)))


def extract_leading_number(title):
    """Extract leading number from filename for sorting."""
    match = re.match(r"(\d+)", title.strip())
    return int(match.group(1)) if match else float('inf')


def scan_videos(directory):
    """Scan a directory for video files and return sorted metadata list."""
    video_metadata = []
    directory = Path(directory).resolve(strict=False)

    # Get course name from parent folder of section
    course_name = directory.parent.name.strip()

    for root, _, files in os.walk(directory):
        section_full = os.path.basename(root).strip()
        section = section_full.split(" - ")[0].strip() if " - " in section_full else section_full

        for file in sorted(files):
            if file.lower().endswith(VIDEO_EXTENSIONS):
                file_path = Path(root) / file
                duration = get_video_duration(file_path)

                metadata = {
                    "title": file,
                    "course": course_name,
                    "section": section,
                    "section_full": section_full,
                    "duration_seconds": int(duration),
                    "duration_formatted": format_time(duration)
                }

                video_metadata.append(metadata)

    # Sort by section number (as int) and leading number in title
    video_metadata.sort(key=lambda x: (try_parse_int(x["section"]), extract_leading_number(x["title"])))
    return video_metadata


def try_parse_int(s):
    """Try to convert string to int, fallback to infinity for non-numeric."""
    try:
        return int(s)
    except ValueError:
        return float('inf')


def save_metadata(metadata, output_path):
    """Save metadata to a JSON file."""
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)
    print(f"\n✅ Metadata saved to {output_path}")
    print(f"📼 Total videos: {len(metadata)}")


def main():
    parser = argparse.ArgumentParser(description="Extract video metadata from a folder.")
    parser.add_argument("folder_path", help="Path to the folder containing videos (e.g. a section folder)")
    parser.add_argument("--output", default="video_metadata.json", help="Output JSON file name")

    args = parser.parse_args()
    path = Path(args.folder_path).resolve(strict=False)

    if not path.exists() or not path.is_dir():
        print("❌ Invalid folder path. Please provide a valid folder.")
        return

    print(f"\n📁 Scanning: {path}")
    metadata = scan_videos(path)
    save_metadata(metadata, args.output)


if __name__ == "__main__":
    main()
