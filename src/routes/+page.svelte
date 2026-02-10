<script lang="ts">
    import ChatWindow from "$lib/components/ChatWindow.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";


</script>

<div class="app">
  <Sidebar />
  <ChatWindow />
</div>

<style>
  .app {
    display: grid;
    grid-template-columns: 360px 1fr;
    height: 100vh;
    background: #efeae2;
  }
</style>
