<script lang="ts">
  let text = "";
</script>

<div class="input-bar">
  <input bind:value={text} placeholder="Type a message" />
  <button>➤</button>
</div>

<style>
  .input-bar {
    display: flex;
    padding: 10px;
    background: #f0f2f5;
  }

  input {
    flex: 1;
    padding: 10px;
    border-radius: 20px;
    border: none;
    outline: none;
  }

  button {
    margin-left: 10px;
    background: #25d366;
    border: none;
    border-radius: 50%;
    color: white;
    width: 40px;
  }
</style>
