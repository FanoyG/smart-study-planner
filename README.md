<p align="center">
  <img src="https://github.com/FanoyG/smart-study-planner/blob/main/Smart_planner_logo_1.png" width="350" alt="Smart Study Planner Logo" />
</p>


![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20S3%20%7C%20DynamoDB-orange?logo=amazonaws&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-brightgreen?logo=html5&logoColor=white)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-purple)

> Transform overwhelming course folders into manageable, time-focused study sessions.

Smart Study Planner is an intelligent backend system that analyzes your course content and creates personalized study plans based on your available time. Perfect for busy learners who want to stay consistent with their learning goals.

## Features

- **Smart Content Analysis**: Automatically extracts duration from videos and metadata from course folders
- **Time-Based Planning**: Get study recommendations based on your available time (30 mins, 1 hour, etc.)
- **Progress Tracking**: Monitor your learning journey with integrated database storage
- **Multi-Format Support**: Handles video files (MP4, MKV) with audio and PDF support coming soon
- **Cloud-Ready**: Built on AWS serverless architecture for scalability

## Use Case

Imagine you've downloaded a 36-hour course but only have 45 minutes to study today. Smart Study Planner:

1. Analyzes your course folder structure
2. Calculates video durations and content breakdown
3. Suggests exactly what you can complete in your available time
4. Tracks your progress for future planning

## Tech Stack

### Backend
- **Python 3.9+** with libraries:
  - `moviepy` - Video duration extraction
  - `mutagen` - Audio metadata (coming soon)
  - `PyPDF2` - PDF analysis (coming soon)

### AWS Infrastructure
- **S3** - Course content storage
- **Lambda Functions** - Serverless processing
  - `GetPreSignedURLsLambda` - Secure file upload URLs
  - `MetadataExtractorLambda` - Content analysis and processing
- **DynamoDB** - User progress and metadata storage
- **API Gateway** - RESTful API endpoints
- **IAM** - Security and access control

## Getting Started

### Prerequisites
- Python 3.9 or higher
- AWS account (for cloud deployment)

### Local Setup
1. Clone the repository
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install moviepy mutagen PyPDF2 typing_extensions
   ```
4. Run locally:
   ```bash
   python main.py
   ```
5. Open `frontend/index.html` in your browser to access the interface

## Project Structure
```
smart-study-planner/
├── lambda/
│   ├── GetPreSignedURLsLambda/
│   └── MetadataExtractorLambda/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── requirements.txt
└── README.md
```

## How It Works

1. **Upload**: Send course folder to S3 via pre-signed URLs
2. **Analysis**: Lambda function extracts metadata (duration, file types, structure)
3. **Storage**: Metadata saved to DynamoDB for quick access
4. **Planning**: Generate study recommendations based on available time
   - Example output: *"You can study 3 videos (38 mins) from Chapter 2"*
5. **Tracking**: Monitor progress and adjust future plans

The **frontend** provides an interactive interface where users can upload folders, view their study plans, and track progress in real-time.

## Development Status

| Feature | Status |
|---------|--------|
| Video duration analysis | ✅ Complete |
| Course folder upload | ✅ Complete |
| DynamoDB integration | ✅ Complete |
| Lambda deployment | 🚧 In Progress |
| Audio/PDF support | 📋 Planned |
| Frontend interface | ✅ Complete |
| User authentication | 📋 Planned |

## Contributing

This project welcomes contributions! Currently seeking help with:

- AWS Lambda layer optimization for Python libraries
- Backend-frontend integration improvements
- Testing and documentation improvements

**Quick Start for Contributors:**
1. Fork the repository
2. Follow the local setup instructions above
3. Create a feature branch: `git checkout -b feature-name`
4. Make your changes and test locally
5. Submit a pull request with a clear description

**AWS Services Overview** (for new contributors):
- **S3**: File storage service for course uploads
- **Lambda**: Serverless functions for processing
- **DynamoDB**: NoSQL database for metadata storage

## Challenges & Solutions

**Current Challenge**: Packaging heavy Python libraries (`moviepy`, `mutagen`) for AWS Lambda deployment.

**Approach**: Exploring Docker-based Lambda layers and lightweight alternatives for cloud deployment.

## Security & Privacy

User uploads are handled securely via AWS S3 with pre-signed URLs. No personal data is stored beyond course metadata and progress tracking.

## FAQ

**Q: What file formats are supported?**  
A: Currently MP4 and MKV videos. Audio (MP3) and PDF support coming soon.

**Q: Do I need AWS to run locally?**  
A: No, local testing works without AWS. Cloud features require AWS setup.

## Contact

**Fanoy** - Python Developer & AWS Learner  
📍 India  
🔗 LinkedIn: [Your LinkedIn Profile]  
📧 Email: mailto:your.email@example.com

---

*"Discipline beats motivation. Smart Study Planner keeps you consistent even when you're short on time."*
