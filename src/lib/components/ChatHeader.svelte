<script lang="ts">
  import { activeChat } from "$lib/stores/chat.store";
</script>

<div class="chat-header">
  {#if $activeChat}
    <img src="/avatar.png" />
    <div class="info">
      <div class="name">{$activeChat.name}</div>
      <div class="status">online</div>
    </div>
    <div class="actions">⋮</div>
  {/if}
</div>

<style>
  .chat-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 10px;
    background: #f0f2f5;
    border-bottom: 1px solid #ddd;
  }

  img {
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
</style>
