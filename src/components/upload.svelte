<script>
  export let videoFile;
  let fileUrl;
  let inputRef;

  const handleUpload = (e) => {
    let target = e.target;
    if (!target || !target.files) return;
    videoFile = target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      fileUrl = reader.result;
    };
    reader.readAsDataURL(videoFile);
  };
</script>

<div class="upload-container" on:click={() => inputRef.click()}>
  <input
    class="hidden"
    bind:this={inputRef}
    on:change={handleUpload}
    type="file"
    accept="video/*"
  />
  {#if fileUrl}
    <video alt="uploaded" src={fileUrl} />
  {:else}
    <div>Upload Video</div>
  {/if}
</div>

<style>
  .upload-container {
    margin: 1rem 0;
    width: 28rem;
    aspect-ratio: 16 / 9;
    background-color: #eee;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    object-fit: cover;
    cursor: pointer;
  }
  .hidden {
    display: none;
  }
</style>
