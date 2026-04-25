import { redirect } from "next/navigation";

import ForumPostForm from "@/components/forum-post-form";
import { createClient } from "@/lib/supabase/server";

type ForumPost = {
  id: number;
  author_display_name: string;
  content: string;
  created_at: string;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function ForumsPage() {
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
      .select("id, author_display_name, content, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const authorDisplayName =
    profile?.display_name ??
    profile?.username ??
    user.email?.split("@")[0] ??
    "Anonymous";

  const forumPosts = (posts ?? []) as ForumPost[];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <section>
        <h1 className="text-2xl font-semibold text-foreground">Forum</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome to the forum!
        </p>
      </section>

      <section>
        <h2 className="text-base font-medium text-foreground">New post</h2>
        <div className="mt-4">
          <ForumPostForm authorDisplayName={authorDisplayName} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-medium text-foreground">Posts</h2>
          <p className="text-sm text-muted-foreground">{forumPosts.length}</p>
        </div>

        {postsError ? (
          <p className="mt-4 text-sm text-red-400">
            Run sql setup on supabase!
          </p>
        ) : forumPosts.length === 0 ? (
          <div className="mt-4 border border-border px-4 py-3 text-sm text-muted-foreground">
            No posts yet. Be the first to start the conversation.
          </div>
        ) : (
          <div className="mt-4 border border-border">
            {forumPosts.map((post) => (
              <article
                key={post.id}
                className="border-b border-border px-4 py-3 last:border-b-0"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    {post.author_display_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(post.created_at)}
                  </p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
