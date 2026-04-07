"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { show, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      show("Password must be at least 8 characters", "error");
      return;
    }
    if (form.password !== form.confirm) {
      show("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: form.password });
    if (error) {
      show(error.message, "error");
      setLoading(false);
    } else {
      show("Password updated successfully", "success");
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {ToastComponent}
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ScopeProp</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Choose a new password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter a new password for your account.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
              autoFocus
              hint="At least 8 characters"
            />
            <Input
              label="Confirm new password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              autoComplete="new-password"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Update password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
