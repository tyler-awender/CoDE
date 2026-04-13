import { Suspense } from "react";
import { Navbar } from "@/components/navbar";

function NavbarFallback() {
  return (
    <nav className="w-full border-b border-border/30 bg-card/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-16 px-5">
        <div className="text-xl font-bold">CoDE</div>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    </nav>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar />
      </Suspense>

      <div className="flex-1 w-full max-w-6xl mx-auto p-5 py-10">
        {children}
      </div>
    </main>
  );
}