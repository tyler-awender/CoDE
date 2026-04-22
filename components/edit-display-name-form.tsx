"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EditDisplayNameForm({
  currentDisplayName,
}: {
  currentDisplayName: string;
}) {
  const [name, setName] = useState(currentDisplayName);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function updateName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("users")
        .update({ display_name: name })
        .eq("id", user.id);
    }

    setLoading(false);
    window.location.reload();
  }

  return (
    <form onSubmit={updateName} className="flex flex-col gap-4 sm:flex-row">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter display name"
        className="w-full rounded-xl border border-border/30 bg-[#0b1f4d] px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary px-5 py-3 text-primary-foreground"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
