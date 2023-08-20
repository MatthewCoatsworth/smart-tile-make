// src/routes/api/openai/+server.js

import { Configuration, OpenAIApi } from 'openai-edge'
import { OPENAI_API_KEY } from '$env/static/private'
import { OpenAIStream, StreamingTextResponse } from 'ai'
//const aiToken = process.env.OPENAI_TOKEN
const apiConfig = new Configuration({
  apiKey: OPENAI_API_KEY,
})
const openai = new OpenAIApi(apiConfig)

function buildPrompt(prompt) {
  return prompt.split('\n').map((message) => ({
    role: 'user',
    content: message,
  }));
}

export const POST = (async ({ request }) => {
  
  // Extract the `prompt` from the body of the request
  const { prompt } = await request.json();

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.createChatCompletion({
  model: 'gpt-3.5-turbo',
  stream: true,
  messages: buildPrompt(prompt),
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
})
