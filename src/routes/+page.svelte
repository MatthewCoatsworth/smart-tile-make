<script>
	/**
	 * @type {null}
	 */
	let imageSrc = null;
	let completion = '';
	let inputValue = '';


  // Convert blob to Base64 data URL
  async function blobToDataURL(/** @type {Blob} */ blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // Display the blob as an image
  async function displayBlobAsImage(/** @type {Blob} */ blob) {
    const dataURL = await blobToDataURL(blob);
    console.log('Image URL:', dataURL);
    imageSrc = dataURL;
  }

    // Call the My HuggingFace API
    async function query(/** @type {{ inputs: string; }} */ data) {
        const response = await fetch('/api/huggingface', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            });
    const result = await response.blob();
    return result;
  }


  async function query2(/** @type {string} */ data) { // Fixed here
    const response = await fetch('/api/openai', {
      method: 'POST',
      body: JSON.stringify({ prompt: data }),
      headers: {
        'content-type': 'application/json'
      }
    });

    completion = await response.text()
    console.log('comp: ', completion);
    return completion;
  }





    // Handle button click
    const callOpenAI = () => {
      query2("only reply with a one word answer. Name a single material used in " + inputValue)
      .then((responseFromQuery2) => {
          console.log('OpenAI Response:', responseFromQuery2);
          return query({ "inputs": "pbr " + responseFromQuery2 });
      })
      .then((responseFromQuery) => {
          displayBlobAsImage(responseFromQuery);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }

  </script>	
<div>
	<h1>Image Generator</h1>
	<input type="text" bind:value={inputValue} placeholder="Enter text here" />
	<button on:click={callOpenAI}>Generate</button>
	{#if imageSrc}
	  <img src={imageSrc} alt="Generated" />
	{/if}
  </div>
  