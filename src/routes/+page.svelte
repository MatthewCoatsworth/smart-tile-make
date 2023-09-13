<script>
  import 'remixicon/fonts/remixicon.css'
  import { ProgressBar } from '@skeletonlabs/skeleton';
 	import { LightSwitch } from '@skeletonlabs/skeleton';
	/**
	 * @type {null}
	 */
	let imageSrc = null;
  let isLoading = false;
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
    isLoading = false;
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
      isLoading = true;
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

<div class="m-8 pb-2">



<div class="grid grid-cols-2 gap-4 place-content-between pb-8">
<div>
  <h3 class="h3">Texsture Image Generator</h3>
</div>
  <div class="justify-self-end">
    <LightSwitch />
  </div>

</div>



<div class="card p-8 mb-8">
  <aside class="alert variant-filled-warning mb-8">
    <!-- Icon -->
    <div><i class="ri-alarm-warning-fill"></i></div>
    <!-- Message -->
    <div class="alert-message">
      <h3 class="h3">Alert</h3>
      <p>This website is early access so it is very likely to break.<br/>
        • If no image apears you can wait a few seconds and then click 'genarate' agnin and see if it works. Try this a couple of times and hope for the best, if it dose not word then its not worth continuing. This will be fixed in later releases.</p>
    </div>
    <!-- Actions -->
    <div class="alert-actions"></div>
  </aside>

  <h2 class="h2 mb-4">How to use my program:</h2>
  
	<h3 class="h3 mb-4">⌨️ Enter text:</h3>
	<p class="mb-8">Click on the input field and type the name of a location or building. For example, you can type "House," "Office," or any other location you have in mind.</p>
  <h3 class="h3 mb-4">🧠 GPT material:</h3>
	<p class="mb-8">ChatGPT will decide on a material that goes in that location.</p>
  <h3 class="h3 mb-4">🤖 Generate image:</h3>
	<p class="mb-8">Stable diffureion will genate the texture ChatGPT desides on.</p>
  <h3 class="h3 mb-4">You must click <kbd class="kbd">Generate</kbd> after typing in the text field to see the result. </h3>

</div>







<div class="card p-8 mb-16">
  <section>
  <input class="input mb-4 p-2" title="Input (text)" type="text" bind:value={inputValue} placeholder="Enter text here" />
  <button type="button" class="btn variant-filled w-full" on:click={callOpenAI}>
    <span><i class="ri-magic-fill"></i></span>
    <span>Generate</span>
    </button>
</section>
<div class="justify-center">
	{#if isLoading}
  <ProgressBar />
  {:else if imageSrc}
	  <img src={imageSrc} alt="Generated" />
	{/if}

</div>
  </div>





</div>