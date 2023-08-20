// src/routes/api/huggingface/+server.js
import { HF_TOKEN } from '$env/static/private'
export async function POST({request}) {
    const { inputs } = await request.json();
    const hfToken = HF_TOKEN; //process.env.HF_TOKEN;
    const response = await fetch(
		"https://api-inference.huggingface.co/models/dream-textures/texture-diffusion",
		{
			headers: { 'Authorization': `Bearer ${hfToken}` },
			method: "POST",
			body: JSON.stringify(inputs),
		}
	);
	return(response);

}
