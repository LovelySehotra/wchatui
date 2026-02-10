<script lang="ts">
  import ChatItem from "./ChatItem.svelte";
  import { chats } from "$lib/stores/chat.store";
</script>

<div class="chat-list">
  {#each chats as chat (chat.id)}
    <ChatItem {chat} />
  {/each}
</div>

<style>
  .chat-list {
    overflow-y: auto;
    flex: 1;
  }
</style>
