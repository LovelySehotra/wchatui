<script lang="ts">
  import { activeChat, messagesByChat } from "$lib/stores/chat.store";
  import MessageBubble from "./MessageBubble.svelte";

  $: messages =
    $activeChat ? messagesByChat[$activeChat.id] || [] : [];
</script>

<div class="message-list">
  {#each messages as msg (msg.id)}
    <MessageBubble message={msg} />
  {/each}
</div>

<style>
  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
</style>
