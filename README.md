# Speech to Text with OpenAI API

This script transcribes an audio file using OpenAI's Whisper model and optionally post-processes the transcription with GPT-4o for corrections. The transcription and corrected text are saved to text files.

## Features

- Transcribes audio files to text using OpenAI's Whisper model.
- Optionally post-processes the transcription with GPT-4o to correct spelling and punctuation.
- Progress bars for uploading the file.
- Saves the transcription and corrected text to text files.

## Supported Audio Formats

- MP3 (`.mp3`)
- MP4 (`.mp4`)
- MPEG (`.mpeg`)
- MPGA (`.mpga`)
- M4A (`.m4a`)
- WAV (`.wav`)
- WEBM (`.webm`)

## Prerequisites

- Node.js (v14 or later)
- npm (Node package manager)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/o-Oby/speech-to-text.git
    cd speech-to-text
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

## Setup

1. **Update API Key:**

    Open the `audio.js` file and replace the placeholder API key with your actual OpenAI API key.

    ```javascript
    const configuration = new Configuration({
      apiKey: 'your-api-key-here', // Replace with your actual API key
    });
    ```

2. **Update File Path:**

    Ensure the file path to your audio file is correct in the `transcribeFile` function.

    ```javascript
    const filePath = path.resolve('path/to/your/audio/file.m4a'); // Replace with your actual file path
    ```

## Usage

1. **Run the script:**

    ```bash
    node audio.js
    ```

2. **Follow the prompts:**

    - The script will ask if you want to post-process the transcription with GPT-4o.
    - Respond with `yes` or `no`.

## Files

- **transcription.txt**: Contains the initial transcription of the audio file.
- **corrected_transcription.txt**: Contains the corrected transcription (if post-processed with GPT-4o).

## License

This project is licensed under the MIT License 
