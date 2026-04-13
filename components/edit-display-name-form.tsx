"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  currentDisplayName: string;
};

export default function EditDisplayNameForm({
  userId,
  currentDisplayName,
}: Props) {
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!displayName.trim()) {
      alert("Display name cannot be empty.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("users")
      .update({ display_name: displayName.trim() })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Display name updated!");
    router.refresh();
  }

  return (
    <form onSubmit={handleUpdate} className="border-t border-white/10 pt-6">
      <h2 className="text-xl font-semibold mb-4">Edit Display Name</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter new display name"
          className="border border-white/20 rounded-lg px-4 py-3 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-3 font-medium disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}