<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { getSocket } from "$lib/socket";

    export let data: any;
    const conversationId = data.conversationId;

    let s: any;

    onMount(() => {
        s = getSocket();
        if (s) {
            s.emit("chat:open", { conversationId });
        }
    });

    onDestroy(() => {
        if (s) {
            s.emit("chat:close");
        }
    });
</script>

<!-- chat UI here -->
