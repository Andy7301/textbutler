# Text Butler

An intelligent iMessage assistant that analyzes incoming messages and provides summaries, importance ratings, and suggested replies using Google's Gemini AI.

## Features

- **AI-Powered Analysis**: Uses Gemini AI to analyze message priority and emotional tone
- **Smart Filtering**: Only processes messages above a minimum character length
- **Auto-Summarization**: Provides TL;DR summaries of long messages
- **Reply Suggestions**: Suggests natural, empathetic replies
- **Smart Notifications**: Only notifies you about high-priority messages

## Setup

### Prerequisites

- macOS
- Node.js 18+ 
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Andy7301/textbutler.git
cd textbutler
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
GEMINI_API_KEY=your_api_key_here
```

4. Configure your phone number in `src/config.ts`:
```typescript
export const MY_NUMBER = '+1234567890';
```

## Usage

Start the bot:
```bash
npm start
```

## Project Structure

```
textbutler/
├── src/
│   ├── index.ts      # Initializes SDK and starts watcher
│   ├── butler.ts     # Message handling logic
│   ├── llm.ts        # Gemini AI integration
│   ├── config.ts     # Configuration constants
│   └── types.ts      # TypeScript type definitions
├── .env              # Environment variables (not in git)
├── package.json
└── tsconfig.json
```

## How It Works

1. **Message Detection**: Watches for incoming messages 
2. **Filtering**: Only processes messages longer than `MIN_CHAR_LENGTH` characters
3. **AI Analysis**: Sends message to Gemini AI for analysis
4. **Smart Notification**: Only sends you a summary if the message is high priority
5. **Summary Format**: Sends a formatted message with:
   - Sender information
   - Emotional vibe
   - Priority rating
   - TL;DR summary
   - Suggested reply

## Configuration

Edit `src/config.ts` to customize:
- `MY_NUMBER`: Your phone number (where summaries are sent)
- `MIN_CHAR_LENGTH`: Minimum message length to analyze