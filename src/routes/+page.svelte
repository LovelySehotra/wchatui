<script lang="ts">
  import { connectSocket } from "$lib/socket";
  import { onMount } from "svelte";
  import { fetchChatHistory } from "$lib/api";
  import { getSocket } from "$lib/socket";

  let status = $state("disconnected");
  let socketId = $state<string | null>(null);
  let selectedUserId = $state<string | null>(null);
  let messages = $state<any[]>([]);
  let loading = $state(false);
  let cursor = $state<string | null>(null);

  let messageText = $state("");
  let onlineUsers = $state<Set<string>>(new Set());

  async function openChat(userId: string) {
    selectedUserId = userId;
    loading = true;

    const data = await fetchChatHistory(userId);

    messages = data.reverse(); // oldest first
    cursor = data.length ? data[0]._id : null;

    loading = false;
  }
  function sendMessage() {
    if (!messageText || !selectedUserId) return;

    const socket = getSocket();
    if (!socket) return;

    const clientMessageId = crypto.randomUUID();

    const optimisticMessage = {
      _id: clientMessageId,
      clientMessageId,
      senderId: "me",
      receiverId: selectedUserId,
      text: messageText,
      status: "sent",
      optimistic: true,
    };
    console.log("Sending message:", optimisticMessage);
    messages = [...messages, optimisticMessage];
    messageText = "";

    socket.emit(
      "send_message",
      {
        clientMessageId,
        receiverId: selectedUserId,
        text: optimisticMessage.text,
      },
      (ack: any) => {
        if (!ack.success) return;

        messages = messages.map((m) =>
          m.clientMessageId === clientMessageId
            ? { ...ack.message, optimistic: false }
            : m,
        );
      },
    );
  }

  onMount(() => {
    const token = localStorage.getItem("token")!;
    console.log("Retrieved token:", token);
    const socket = connectSocket(token);
    console.log("Socket initialized:", socket);
    socket.on("connect", () => {
      status = "connected";
      socketId = socket.id;
    });
    socket.on("receive_message", (msg) => {
      console.log("Received message:", msg);
      if (msg.senderId === selectedUserId) {
        messages = [...messages, msg];
      }
    });
    socket.on("disconnect", () => {
      status = "disconnected";
      socketId = null;
    });
    socket.on("user_online", ({ userId }) => {
      onlineUsers = new Set(onlineUsers).add(userId);
    });

    socket.on("user_offline", ({ userId }) => {
      const next = new Set(onlineUsers);
      next.delete(userId);
      onlineUsers = next;
    });
  });
</script>

<h1>Chat App</h1>

<p>Status: {status}</p>
{#if socketId}
  <p>Socket ID: {socketId}</p>
{/if}
<hr />
<hr />

<div style="display:flex; height:70vh">
  <!-- User List -->
  <div style="width:200px; border-right:1px solid #ccc">
    <h3>Users</h3>
    <button on:click={() => openChat(user.id)}>
      {user.name}
      {#if onlineUsers.has(user.id)}
        <span style="color:green"> ● online</span>
      {/if}
    </button>
    <button on:click={() => openChat("user2")}>User Two</button>
  </div>

  <!-- Chat Window -->
  <div style="flex:1; padding:10px; display:flex; flex-direction:column;">
    {#if !selectedUserId}
      <p>Select a user</p>

      <!-- {:else if loading}
    <p>Loading messages...</p> -->
    {:else}
      <!-- Messages (scrollable) -->
      <div style="flex:1; overflow-y:auto; border:1px solid #ddd; padding:5px;">
        {#each messages as msg}
          <div>
            <b>{msg.senderId}:</b>
            {msg.text}
          </div>
        {/each}
      </div>
      {#if typingUsers.has(selectedUserId)}
        <p><i>Typing...</i></p>
      {/if}
      <!-- Input (fixed) -->
      <div style="margin-top:10px; display:flex; gap:5px;">
        <input
          bind:value={messageText}
          placeholder="Type a message"
          on:input={() => {
            socket.emit("typing_start", { receiverId: selectedUserId });

            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
              socket.emit("typing_stop", { receiverId: selectedUserId });
            }, 1000);
          }}
        />
        <button on:click={sendMessage}>Send</button>
      </div>
    {/if}
  </div>
</div>
