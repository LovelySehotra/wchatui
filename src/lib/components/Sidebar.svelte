<script lang="ts">
  import ChatList from "./ChatList.svelte";
</script>

<div class="sidebar">
  <div class="sidebar-header">
    <img src="/avatar.png" />
    <div class="actions">⋮</div>
  </div>

  <ChatList />
</div>

<style>
  .sidebar {
    background: #ffffff;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    height: 60px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f0f2f5;
  }

  img {
    width: 40px;
    border-radius: 50%;
  }
</style>
