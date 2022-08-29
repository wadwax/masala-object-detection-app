<script>
  import axios from "axios";
  import { uploadToS3 } from "../lib/masala";
  import CredentialForm from "../components/credentials.svelte";
  import Upload from "../components/upload.svelte";

  let awsUsername, awsAccessKey, awsSecretKey, videoFile;
  let resultUrl, errorMessage; // we will show the result URL to the user once the request is successful

  let status = "ready";

  const handleError = (res) => {
    status = "error";
    if (res.response) {
      errorMessage = `Status ${res.response.status} - ${res.response.data}`;
    } else {
      errorMessage = res.message;
    }
  };

  const handleRequest = async () => {
    status = "requesting";
    const credentials = {
      awsUsername,
      awsAccessKey,
      awsSecretKey,
    };

    try {
      // calling proxy API to generate request ID
      let requestId = (await axios.post("/api/requests", credentials)).data
        .requestId;

      // uploading video file to S3 bucket
      status = "uploading video";
      await uploadToS3(requestId, credentials, videoFile);

      // start task
      status = "starting task";
      await axios.post("/api/tasks", { requestId, credentials });

      // retrieve task status until it's finished or returns error
      let result = (await axios.post("/api/status", { requestId, credentials }))
        .data[0].task_list[0];
      status = result.status;

      while (status !== "finish" && status !== "error") {
        result = (await axios.post("/api/status", { requestId, credentials }))
          .data[0].task_list[0];
        status = result.status;
      }

      // handle result
      if (status === "finish") {
        let s3Uri = result.result.target_list[0].result_s3_uri;
        let s3Prefix = s3Uri
          .replace("s3://", "")
          .replace("eba-va-s3-read-dev/", "");
        resultUrl = `https://s3.console.aws.amazon.com/s3/buckets/eba-va-s3-read-dev/?region=ap-northeast-1&prefix=${s3Prefix}`;
      }
      if (status === "error") {
        errorMessage = result.result.target_list[0].message;
      }
    } catch (e) {
      handleError(e);
    }
  };
</script>

<div class="container">
  <h1>Welcome to Masala</h1>
  <CredentialForm bind:awsUsername bind:awsAccessKey bind:awsSecretKey />
  <Upload bind:videoFile />
  {#if status === "ready"}
    <button class="btn btn-main" on:click={handleRequest}>Request</button>
  {:else if status === "finish"}
    <button class="btn btn-main" on:click={handleRequest}>Request Again</button>
    <span class="success"
      >Succeful! Click
      <a href={resultUrl} target="_blank">HERE</a>
      to download the result</span
    >
  {:else if status === "error"}
    <button class="btn btn-main" on:click={handleRequest}>Request Again</button>
    <span class="err">Error: {errorMessage}</span>
  {:else}
    <button class="btn btn-loading"
      >{status[0].toUpperCase() + status.slice(1).replace("_", " ")}</button
    >
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .err {
    margin-top: 0.5rem;
    font-size: 14pt;
    color: red;
  }
  .success {
    margin-top: 0.5rem;
    font-size: 14pt;
    color: rgb(13 148 136);
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
  .btn-loading {
    background-color: rgb(45 212 191);
    color: white;
    cursor: wait;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0% {
      background-color: rgb(45 212 191);
    }
    50% {
      background-color: rgb(153 246 228);
    }
    100% {
      background-color: rgb(45 212 191);
    }
  }
</style>
