<script lang="ts">
  import { register } from "$lib/auth";
  import { goto } from "$app/navigation";

  let name = $state("");
  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  async function submit() {
    error = "";
    loading = true;

    try {
      await register(name, email, password);
      goto("/login");
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<h2>Register</h2>

<input placeholder="Name" bind:value={name} />
<input placeholder="Email" bind:value={email} />
<input type="password" placeholder="Password" bind:value={password} />

<button on:click={submit} disabled={loading}>
  {loading ? "Registering..." : "Register"}
</button>

{#if error}
  <p style="color:red">{error}</p>
{/if}

<p>
  Already have an account?
  <a href="/login">Login</a>
</p>
<style>
  input {
    display: block;
    margin: 10px 0;
  }
</style>