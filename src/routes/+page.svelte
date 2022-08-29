<script>
  import CredentialForm from "../components/credentials.svelte";
  import Upload from "../components/upload.svelte";

  let awsUsername, awsAccessKey, awsSecretKey, videoFile;

  const handleRequest = async () => {
    // request logic goes here
  };
</script>

<div class="container">
  <h1>Welcome to Masala</h1>
  <CredentialForm bind:awsUsername bind:awsAccessKey bind:awsSecretKey />
  <Upload bind:videoFile />
  <button class="btn btn-main" on:click={handleRequest}>Request</button>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .btn {
    width: 28rem;
    padding: 0.8rem;
    font-size: 16pt;
    border-radius: 0.5rem;
    border: none;
    box-shadow: #ccc 0.1rem 0.2rem 0.1rem;
  }
  .btn-main {
    background-color: rgb(45 212 191);
    color: white;
    cursor: pointer;
  }
</style>
