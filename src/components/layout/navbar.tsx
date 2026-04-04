"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavbarProps {
  user?: { email?: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 group-hover:bg-violet-700 transition-colors">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <span className="text-lg font-bold text-gray-900">ScopeProp</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-500">
          <Link href="/#features" className="hover:text-gray-900 transition-colors duration-150">Features</Link>
          <Link href="/#pricing" className="hover:text-gray-900 transition-colors duration-150">Pricing</Link>
          <Link href="/#how-it-works" className="hover:text-gray-900 transition-colors duration-150">How it works</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" loading={loading} onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="shadow-sm shadow-violet-200">
                <Link href="/auth/signup">Start free →</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
