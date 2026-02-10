<script lang="ts">
  export let message;
</script>

<div class="bubble {message.isMine ? 'mine' : 'theirs'}">
  {message.text}
</div>

<style>
  .bubble {
    max-width: 60%;
    padding: 8px 12px;
    border-radius: 8px;
    margin: 6px;
  }

  .mine {
    background: #d9fdd3;
    margin-left: auto;
  }

  .theirs {
    background: white;
    margin-right: auto;
  }
</style>
