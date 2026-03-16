import { Navbar } from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-6xl mx-auto p-5 py-10">
        {children}
      </div>
      <footer className="w-full border-t border-border/30 py-8">
        <div className="mx-auto max-w-6xl px-5 flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>CoDE - Cove of Delightful Entertainment</p>
          <p>CS 160, Section 02, Spring 2026 - Team #7</p>
        </div>
      </footer>
    </main>
  );
}
