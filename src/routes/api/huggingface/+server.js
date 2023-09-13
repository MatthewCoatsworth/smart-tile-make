// src/routes/api/huggingface/+server.js
//import { HF_TOKEN } from '$env/static/private'

// The `POST` function takes a single argument, an object called `request`.
export async function POST({request}) {
	// Parse the JSON data from the HTTP request's body and extract the `inputs` property.
    const { inputs } = await request.json();
	// Retrieve the Hugging Face API token from an environment variable named `HF_TOKEN`.
    const hfToken = process.env.HF_TOKEN; // HF_TOKEN; 
	// Create an HTTP POST request to the Hugging Face API.
    const response = await fetch(
		"https://api-inference.huggingface.co/models/dream-textures/texture-diffusion",
		{
			// Include the Hugging Face API token in the request's authorization header.
			headers: { 'Authorization': `Bearer ${hfToken}` },
			method: "POST",
			// Send the JSON-encoded `inputs` data in the request body.
			body: JSON.stringify(inputs),
		}
	);
	// Return the response from the Hugging Face API to the caller.
	return(response);

}
