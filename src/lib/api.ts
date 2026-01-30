export async function fetchChatHistory(
  otherUserId: string,
  cursor?: string
) {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams();
  params.set("otherUserId", otherUserId);
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(
    `http://localhost:3001/chat/messages?${params.toString()}`,
    {
      headers: {
        Authorization: token!,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to load messages");

  return res.json();
}
