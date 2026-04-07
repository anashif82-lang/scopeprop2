"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proposals", label: "Proposals", icon: FileText },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-100 bg-white px-4 py-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8 group">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 group-hover:bg-violet-700 transition-colors">
          <span className="text-sm font-bold text-white">S</span>
        </div>
        <span className="text-lg font-bold text-gray-900">ScopeProp</span>
      </Link>

      {/* New Proposal CTA */}
      <Link
        href="/proposals/new"
        className="flex items-center gap-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition-all px-3.5 py-2.5 text-sm font-bold text-white mb-6 shadow-sm shadow-violet-200"
      >
        <PlusCircle className="h-4 w-4 flex-shrink-0" />
        New Proposal
      </Link>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
              isActive(href)
                ? "bg-violet-50 text-violet-700 font-bold border-l-2 border-violet-500 pl-[10px]"
                : "text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-800"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 flex-shrink-0",
                isActive(href) ? "text-violet-600" : "text-gray-400"
              )}
            />
            {label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-px bg-gray-100 my-4" />

      {/* Sign out */}
      <button
        onClick={signOut}
        disabled={loading}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all duration-150 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        {loading ? "Signing out…" : "Sign out"}
      </button>
    </aside>
  );
}
