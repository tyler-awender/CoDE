"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

const MAX_POST_LENGTH = 500;

export default function ForumPostForm({
  authorDisplayName,
}: {
  authorDisplayName: string;
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Write something before posting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("You need to be signed in to post.");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("forum_posts").insert({
      author_display_name: authorDisplayName,
      content: trimmedContent,
    });

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    setContent("");
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value.slice(0, MAX_POST_LENGTH))}
        placeholder="Type here"
        rows={5}
        className="min-h-32 w-full border border-border px-3 py-2 text-sm text-black outline-none"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-border px-4 py-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
