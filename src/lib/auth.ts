export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
}
export async function register(
  name: string,
  email: string,
  password: string
) {
  const res = await fetch("http://localhost:3001/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }

  return res.json();
}
export async function fetchUsers() {
  const res = await fetch("http://localhost:3001/users/", {
    // credentials: "include",
  });

  console.log("Fetch users response:", res);
  if (!res.ok) throw new Error("Failed to fetch users");

  return res.json();
}