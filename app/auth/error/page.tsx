import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">
          Sign up failed: {params.error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Sign up failed. This email or username may already be in use.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <Link
          href="/auth/sign-up"
          className="inline-block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Try Again
        </Link>

        <Link
          href="/"
          className="inline-block w-full rounded-md border px-4 py-2 text-center text-sm"
        >
          Back Home
        </Link>
      </div>
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-red-500">
                Sign Up Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

