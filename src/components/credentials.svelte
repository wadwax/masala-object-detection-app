<script>
  // exporting the input data to be used by parent components
  export let awsUsername;
  export let awsAccessKey;
  export let awsSecretKey;
</script>

<form>
  <div class="form-item">
    <label class="label" for="awsUsername">AWS Username</label>
    <input
      bind:value={awsUsername}
      class="input"
      name="awsUsername"
      type="text"
      placeholder="masala.dev.taro.masala"
    />
  </div>
  <div class="form-item">
    <label class="label" for="awsAccessKey">AWS Access Key</label>
    <input
      bind:value={awsAccessKey}
      class="input"
      name="awsAccessKey"
      type="password"
      placeholder="AKIAZN3J..."
    />
  </div>
  <div class="form-item">
    <label class="label" for="awsSecretKey">AWS Secret Key</label>
    <input
      bind:value={awsSecretKey}
      class="input"
      name="awsSecretKey"
      type="password"
      placeholder="kQvRb3GE/ymdh..."
    />
  </div>
</form>

<style>
  .form-item {
    width: 26rem;
    padding: 0.5rem 0.8rem;
    margin-top: 1rem;
    border: 0.01rem gray solid;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .label {
    width: 12rem;
  }
  .input {
    width: 100%;
    padding: 0.5rem;
    font-size: 12pt;
    border: none;
    outline: none;
  }
</style>
