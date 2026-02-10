<script lang="ts">
    import ChatHeader from "./ChatHeader.svelte";
    import MessageInput from "./MessageInput.svelte";
    import MessageList from "./MessageList.svelte";


</script>

<div class="chat-window">
  <ChatHeader />
  <MessageList />
  <MessageInput />
</div>

<style>
  .chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: url("/chat-bg.png");
  }
</style>
