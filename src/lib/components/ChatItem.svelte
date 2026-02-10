<script lang="ts">
  export let chat;
</script>

<div class="chat-item">
  <img src="/avatar.png" />

  <div class="content">
    <div class="top">
      <span class="name">{chat.name}</span>
      <span class="time">{chat.lastTime}</span>
    </div>

    <div class="bottom">
      <span class="message">{chat.lastMessage}</span>

      {#if chat.unreadCount > 0}
        <span class="badge">{chat.unreadCount}</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .chat-item {
    display: flex;
    padding: 12px;
    cursor: pointer;
  }

  .chat-item:hover {
    background: #f5f6f6;
  }

  img {
    width: 48px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .top {
    display: flex;
    justify-content: space-between;
  }

  .badge {
    background: #25d366;
    color: white;
    border-radius: 12px;
    padding: 2px 6px;
    font-size: 12px;
  }
</style>
