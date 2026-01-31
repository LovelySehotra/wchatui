<script lang="ts">
  import { connectSocket } from "$lib/socket";
  import { onMount } from "svelte";
  import { fetchChatHistory } from "$lib/api";
  import { getSocket } from "$lib/socket";
  import { fetchUsers } from "$lib/auth";

  let status = $state("disconnected");
  let socketId = $state<string | null | undefined>(null);
  let selectedUserId = $state<string | null>(null);
  let messages = $state<any[]>([]);
  let loading = $state(false);
  let cursor = $state<string | null>(null);
  let myUserId = $state<string>("me");

  let messageText = $state("");
  let onlineUsers = $state<Set<string>>(new Set());
  let typingTimeout: number | null | any = 300;
  let typingUsers = $state<Set<string>>(new Set());
  let users = $state<any[]>([]);

  async function openChat(userId: string) {
    selectedUserId = userId;
    loading = true;

    const data = await fetchChatHistory(userId);

    messages = data.reverse(); // oldest first
    cursor = data.length ? data[0]._id : null;

    loading = false;
  }
  function handleTyping(receiverId: string | null) {
    if (!receiverId) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("typing_start", { receiverId });

    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.emit("typing_stop", { receiverId });
    }, 1000);
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
    // console.log("Sending message:", optimisticMessage);
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
  const handlerFetchUsers = async () => {
    // Placeholder function - replace with actual API call
    try {
      const data = await fetchUsers();
      console.log("Fetched users data:", data[0].name);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  onMount(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    users = await handlerFetchUsers();

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
    socket.on("user_typing", ({ userId }) => {
      console.log("User typing:", userId);
      typingUsers = new Set(typingUsers).add(userId);
    });

    socket.on("user_stop_typing", ({ userId }) => {
      const next = new Set(typingUsers);
      next.delete(userId);
      typingUsers = next;
    });
  });
  // svelte-ignore state_referenced_locally
    console.log("typingUsers list:", typingUsers);
</script>

<div class="app">
  <!-- Sidebar -->
  <aside class="sidebar">
    <h3>Chats</h3>

    {#each users as user}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore event_directive_deprecated -->
      <div
        class="chat-item {selectedUserId === user._id ? 'active' : ''}"
        on:click={() => openChat(user._id)}
      >
        <div class="avatar">{user.name[0]}</div>

        <div class="chat-info">
          <div class="name">{user.name}</div>
          {#if onlineUsers.has(user._id)}
            <div class="status online">online</div>
          {/if}
        </div>
      </div>
    {/each}
  </aside>

  <!-- Chat Area -->
  <main class="chat">
    {#if !selectedUserId}
      <div class="empty">Select a chat</div>
    {:else}
      <!-- Header -->
      <div class="chat-header">
        <div class="header-name">{selectedUserId}</div>
        {#if onlineUsers.has(selectedUserId)}
          <span class="online-dot">● online</span>
        {/if}
      </div>

      <!-- Messages -->
      <div class="messages">
        {#each messages as msg}
          <div class="message {msg.senderId === 'me' ? 'sent' : 'received'}">
            <div class="bubble">
              {msg.text}
            </div>
          </div>
        {/each}

        {#if typingUsers.has(selectedUserId)}
          <div class="typing">typing...</div>
        {/if}
      </div>

      <!-- Input -->
      <div class="input-box">
        <!-- svelte-ignore event_directive_deprecated -->
        <input
          placeholder="Type a message"
          bind:value={messageText}
          on:input={() => handleTyping(selectedUserId)}
          on:keydown={(e) => e.key === "Enter" && sendMessage()}
        />
        <!-- svelte-ignore event_directive_deprecated -->
        <button on:click={sendMessage}>Send</button>
      </div>
    {/if}
  </main>
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
  }

  /* Sidebar */
  .sidebar {
    width: 280px;
    background: #ffffff;
    border-right: 1px solid #ddd;
    padding: 10px;
  }

  .chat-item {
    display: flex;
    gap: 10px;
    padding: 10px;
    cursor: pointer;
    border-radius: 6px;
  }

  .chat-item:hover {
    background: #f5f5f5;
  }

  .chat-item.active {
    background: #e9edef;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: #25d366;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .chat-info .name {
    font-weight: 600;
  }

  .status.online {
    font-size: 12px;
    color: green;
  }

  /* Chat area */
  .chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #efeae2;
  }

  .chat-header {
    padding: 12px;
    background: #f0f2f5;
    border-bottom: 1px solid #ddd;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .online-dot {
    color: green;
    font-size: 12px;
  }

  .messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
  }

  .message {
    display: flex;
    margin-bottom: 10px;
  }

  .message.sent {
    justify-content: flex-end;
  }

  .bubble {
    max-width: 60%;
    padding: 10px;
    border-radius: 8px;
    background: white;
  }

  .message.sent .bubble {
    background: #d9fdd3;
  }

  .typing {
    font-size: 12px;
    color: gray;
  }

  /* Input */
  .input-box {
    display: flex;
    gap: 10px;
    padding: 10px;
    background: #f0f2f5;
  }

  .input-box input {
    flex: 1;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
  }

  .input-box button {
    padding: 10px 16px;
    border-radius: 20px;
    border: none;
    background: #25d366;
    color: white;
    cursor: pointer;
  }
</style>
