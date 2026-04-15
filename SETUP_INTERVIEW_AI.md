# Interview AI Coach Setup Instructions

## Environment Setup

1. **Create .env.local file** (if it doesn't exist):
   ```bash
   touch .env.local
   ```

2. **Add your Gemini API Key** to `.env.local`:
   ```
   GEMINI_API_KEY=AIzaSyAXcwZxwtcflzd5hzjHYf8MjalVGZo2t6M
   ```

   **Important**: Make sure `.env.local` is in your `.gitignore` file and never commit it to version control.

## Features Implemented

### Backend API (`/api/interview/route.ts`)
- **Gemini 1.5 Flash** model integration
- **System Instruction**: Rwanda Job Hub AI Coach with STAR method feedback
- **Context Management**: Maintains conversation history
- **End Interview Summary**: Provides comprehensive performance analysis
- **Error Handling**: Robust error responses

### Frontend Chat Interface (`/resources?page=interview`)
- **Modern Chat UI**: Clean, professional design
- **Message History**: Full conversation display with timestamps
- **Loading States**: Animated typing indicator when AI is responding
- **End Interview Button**: Generates performance summary
- **Mobile Optimized**: Fully responsive for phone users in Kigali
- **Auto-start**: Begins interview when accessing `/resources?category=interview`

### Chat Features
- **Real-time Messaging**: Instant send/receive
- **User/AI Distinction**: Clear visual separation
- **Timestamp Display**: Shows message times
- **Auto-scroll**: Automatically scrolls to latest messages
- **Input Validation**: Prevents empty messages
- **Keyboard Support**: Enter to send, Shift+Enter for new line

### Navigation Flow
1. **Exams Page** (`/exams`) - Two cards linking to resources
2. **Resources Hub** (`/resources`) - Category selection
3. **Interview Coach** (`/resources?category=interview`) - Live chat interface
4. **Q&A Resources** (`/resources?category=qa`) - Placeholder for future content

## Usage

1. Navigate to `/exams` and click "Start Prep" on the Interview card
2. The AI coach will automatically start the interview
3. Respond to questions naturally
4. Get STAR method feedback after each answer
5. Click "End Interview" anytime for a performance summary
6. Start a new interview when ready

## Mobile Optimization

- **Responsive Design**: Works perfectly on phones
- **Touch-friendly**: Large tap targets
- **Viewport Optimized**: Uses full screen efficiently
- **Readable Text**: Appropriate font sizes for mobile
- **Smooth Scrolling**: Optimized for touch devices

## Technical Details

- **Framework**: Next.js 14 with App Router
- **AI Model**: Google Gemini 1.5 Flash
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks (useState, useEffect, useRef)
- **Real-time**: WebSocket-like experience via HTTP polling
