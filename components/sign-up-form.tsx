"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpForm() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password || !repeatPassword || !username || !displayName) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== repeatPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim(),
          display_name: displayName.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error("Sign up error:", error);
      alert(error.message);
      return;
    }

    alert("Account created! Check your email if confirmation is required.");

    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setUsername("");
    setDisplayName("");
  }

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Sign up</h1>
      <p>Create a new account</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <input
        type="password"
        placeholder="Repeat Password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-teal-600 text-white px-4 py-2 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Sign up"}
      </button>
    </form>
  );
}
