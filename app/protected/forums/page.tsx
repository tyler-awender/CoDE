import { Suspense } from "react";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ForumPostForm from "@/components/forum-post-form";
import { createClient } from "@/lib/supabase/server";

type ForumPost = {
  id: number;
  user_id: string;
  author_display_name: string;
  content: string;
  created_at: string;
};

type ForumAuthor = {
  id: string;
  display_name: string | null;
  username: string | null;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getProfileDisplayName(profile: Pick<ForumAuthor, "display_name" | "username"> | null | undefined) {
  return profile?.display_name ?? profile?.username ?? null;
}

function ForumsFallback() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">Forums</h1>
        <p className="mt-2 text-sm text-muted-foreground">Loading forums...</p>
      </section>
    </div>
  );
}

async function ForumsContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data.claims;

  const [{ data: profile }, { data: posts, error: postsError }] = await Promise.all([
    supabase
      .from("users")
      .select("display_name, username")
      .eq("id", user.sub)
      .single(),
    supabase
      .from("forum_posts")
      .select("id, user_id, author_display_name, content, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const authorDisplayName =
    getProfileDisplayName(profile) ??
    user.email?.split("@")[0] ??
    "Anonymous";

  const forumPosts = (posts ?? []) as ForumPost[];
  const authorIds = Array.from(new Set(forumPosts.map((post) => post.user_id)));
  const { data: authorProfiles } = authorIds.length
    ? await supabase
        .from("users")
        .select("id, display_name, username")
        .in("id", authorIds)
    : { data: [] };

  const authorsById = new Map(
    ((authorProfiles ?? []) as ForumAuthor[]).map((author) => [
      author.id,
      getProfileDisplayName(author),
    ]),
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">Forums</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to the forums!
        </p>
      </section>

      <section>
        <ForumPostForm authorDisplayName={authorDisplayName} />
      </section>

      <section>
        {postsError ? (
          <p className="mt-4 text-sm text-red-400">
            Run sql setup on supabase!
          </p>
        ) : forumPosts.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              No posts yet. Be the first to start the conversation.
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Posts</CardTitle>
                <CardDescription>
                  See what others are saying
                </CardDescription>
              </div>
              <p className="text-sm text-muted-foreground">
                {forumPosts.length}
              </p>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4">
                {forumPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-md border border-border bg-background p-4"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-bold text-foreground">
                        {authorsById.get(post.user_id) ?? post.author_display_name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(post.created_at)}
                      </p>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                      {post.content}
                    </p>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

export default function ForumsPage() {
  return (
    <Suspense fallback={<ForumsFallback />}>
      <ForumsContent />
    </Suspense>
  );
}
