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

<div class="m-64">



<div class="grid grid-cols-2 gap-4 place-content-between pb-8">
<div>
  <h2 class="h2 pb-8">Image Generator</h2>
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
      <p>this website is Early access and is likely to break</p>
    </div>
    <!-- Actions -->
    <div class="alert-actions">(buttons)</div>
  </aside>

	<h2 class="h2 mb-4">step one</h2>
	<p class="mb-8">The quick brown fox jumps over the lazy dog.</p>
	<h2 class="h2 mb-4">step two</h2>
	<p >The quick brown fox jumps over the lazy dog.</p>
</div>






<div class="card p-8">
  <section>
  <input class="input mb-4" title="Input (text)" type="text" bind:value={inputValue} placeholder="Enter text here" />
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