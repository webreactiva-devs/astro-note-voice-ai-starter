# Groq API Integration

## Overview
This document describes the Groq API integration for audio transcription in the voice notes application.

## Configuration

### Environment Variables
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Supported Audio Formats
- WebM (default from MediaRecorder)
- OGG
- WAV
- MP3/MPEG
- MP4
- M4A

### Model Configuration
- **Model**: `whisper-large-v3` (Groq's Whisper implementation)
- **Language**: `es` (Spanish)
- **Response Format**: `json`
- **Max File Size**: 10MB

## API Endpoint

### POST `/api/transcribe`

**Authentication**: Required (Better Auth session)

**Request**: 
- Content-Type: `multipart/form-data`
- Body: FormData with `audio` file

**Response**:
```json
{
  "transcription": "Texto transcrito del audio...",
  "success": true
}
```

**Error Response**:
```json
{
  "error": "Descripción del error",
  "success": false
}
```

## Implementation Details

### Audio Processing Flow
1. Validate user authentication
2. Extract audio file from FormData
3. Validate file type and size
4. Prepare FormData for Groq API
5. Send to Groq Whisper endpoint
6. Return transcribed text

### Error Handling
- Authentication errors (401)
- File validation errors (400)
- Groq API errors (500)
- Network/timeout errors (500)

## Testing
Test the transcription with different audio formats and languages to ensure accuracy.

## Rate Limits
Check Groq API documentation for current rate limits and adjust usage accordingly.