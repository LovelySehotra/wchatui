<script lang="ts">
  import { login } from "$lib/auth";
  import { goto } from "$app/navigation";

  let email = $state("");
  let password = $state("");
  let error = $state("");

  async function submit() {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      goto("/");
    } catch (e) {
      error = "Invalid credentials";
    }
  }
</script>

<h2>Login</h2>

<input placeholder="Email" bind:value={email} />
<input type="password" placeholder="Password" bind:value={password} />
<button on:click={submit}>Login</button>

{#if error}
  <p style="color:red">{error}</p>
{/if}
<style>
  input {
    display: block;
    margin: 10px 0;
  }
</style>
