"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create Post</CardTitle>
          <CardDescription>
            Share something with the community
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">

              <div className="grid gap-2">
                <Label>Content</Label>
                <textarea
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value.slice(0, MAX_POST_LENGTH)
                    )
                  }
                  placeholder="What's on your mind?"
                  rows={5}
                  className="min-h-32 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {content.length}/{MAX_POST_LENGTH}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>

            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
