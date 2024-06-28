// Import necessary modules
import fs from 'fs'; // File system module to handle file operations
import path from 'path'; // Path module to handle file paths
import FormData from 'form-data'; // FormData module to handle form data
import axios from 'axios'; // Axios module to make HTTP requests
import readlineSync from 'readline-sync'; // Module to handle synchronous user input
import { Configuration, OpenAIApi } from 'openai'; // OpenAI API module
import ProgressBar from 'progress'; // Module to create progress bars
import chalk from 'chalk'; // Module to add color to terminal output

// Configure the OpenAI API with your API key
const configuration = new Configuration({
  apiKey: 'your-api-key-here', // Replace with your actual API key
});

const openai = new OpenAIApi(configuration);

// Function to transcribe an audio file
async function transcribeFile() {
  console.log(chalk.blue("Starting transcription process..."));

  try {
    // Define the path to the audio file
    const filePath = path.resolve('path/to/your/audio/file.m4a'); // Replace with your actual file path
    console.log(chalk.blue(`Processing file: ${filePath}`));

    // Create a read stream for the file
    const fileStream = fs.createReadStream(filePath);
    const fileSize = fs.statSync(filePath).size;

    // Prepare the form data for the API request
    const form = new FormData();
    form.append('file', fileStream);
    form.append('model', 'whisper-1');
    form.append('response_format', 'text');
    form.append('prompt', 'ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T.');

    // Set up a progress bar for the upload
    const uploadProgressBar = new ProgressBar(chalk.yellow('Uploading [:bar] :percent :etas'), {
      width: 40,
      complete: '=',
      incomplete: ' ',
      total: fileSize
    });

    // Update the progress bar as the file is read
    fileStream.on('data', (chunk) => {
      uploadProgressBar.tick(chunk.length);
    });

    // Define the headers for the API request
    const headers = {
      ...form.getHeaders(),
      'Authorization': `Bearer ${configuration.apiKey}`,
    };

    console.log(chalk.blue("Sending request to OpenAI API..."));

    // Send the API request to transcribe the audio file
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, { 
      headers,
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        uploadProgressBar.tick(progressEvent.loaded - uploadProgressBar.curr);
      }
    });

    console.log(chalk.blue("File uploaded. Processing transcription..."));

    // Check if the response contains the transcription text
    if (response.data && typeof response.data === 'string') {
      const transcription = response.data;
      fs.writeFileSync('transcription.txt', transcription);
      console.log(chalk.green("Transcription successfully written to transcription.txt"));
      return transcription;
    } else if (response.data && response.data.text) {
      const transcription = response.data.text;
      fs.writeFileSync('transcription.txt', transcription);
      console.log(chalk.green("Transcription successfully written to transcription.txt"));
      return transcription;
    } else {
      const errorMessage = 'Unexpected response format: ' + JSON.stringify(response.data);
      fs.writeFileSync('transcription.txt', errorMessage);
      console.log(chalk.red("Error: Unexpected response format. Details saved to transcription.txt"));
      return null;
    }
  } catch (error) {
    const errorMessage = error.response ? 
      `Error response data: ${JSON.stringify(error.response.data)}\nError response status: ${error.response.status}\nError response headers: ${JSON.stringify(error.response.headers)}` : 
      error.request ? 
        `Error request data: ${JSON.stringify(error.request)}` : 
        `Error message: ${error.message}`;

    fs.writeFileSync('transcription.txt', errorMessage);
    console.error(chalk.red("Error: Details saved to transcription.txt"));
    return null;
  }
}

// Function to post-process the transcription with GPT-4o
async function postProcessWithGPT4(transcription) {
  const systemPrompt = "You are a helpful assistant for the company. Your task is to correct any spelling discrepancies in the transcribed text. Only add necessary punctuation such as periods, commas, and capitalization, and use only the context provided.";

  console.log(chalk.blue("Post-processing transcription with GPT-4o..."));

  try {
    // Send the transcription to GPT-4o for post-processing
    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcription }
      ]
    });

    const correctedText = response.data.choices[0].message.content;

    // Save the corrected transcription to a file
    fs.writeFileSync('corrected_transcription.txt', correctedText);
    console.log(chalk.green("Corrected transcription successfully written to corrected_transcription.txt"));
  } catch (error) {
    const errorMessage = `Error processing transcription with GPT-4o: ${error.message}`;
    fs.writeFileSync('corrected_transcription.txt', errorMessage);
    console.error(chalk.red("Error: Details saved to corrected_transcription.txt"));
  }
}

// Main function to orchestrate the transcription and post-processing
async function main() {
  const transcription = await transcribeFile();
  if (transcription) {
    const postProcess = readlineSync.question('Do you want to post-process the transcription with GPT-4o? (yes/no): ');
    if (postProcess.toLowerCase() === 'yes') {
      await postProcessWithGPT4(transcription);
    } else {
      console.log(chalk.blue("Post-processing skipped."));
    }
  } else {
    console.log(chalk.red("Transcription failed. No post-processing will be done."));
  }
}

// Start the main function
main();
