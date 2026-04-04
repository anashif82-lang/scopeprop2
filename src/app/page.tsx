import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import {
  Zap,
  FileText,
  Eye,
  PenLine,
  CheckCircle2,
  ArrowRight,
  Star,
  Package,
} from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar user={user} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-28 pb-24 overflow-hidden">
        {/* Radial halo */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(139,92,246,0.14),transparent)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-violet-50/70 via-white/50 to-white" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/90 px-4 py-1.5 text-xs font-semibold text-violet-700 mb-8 shadow-sm">
          <Zap className="h-3.5 w-3.5" />
          AI-powered proposal generation · Used by 500+ freelancers
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-6xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.05]">
          Win more clients with proposals that{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
            write themselves
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-7 max-w-2xl text-xl text-gray-500 leading-relaxed">
          Paste your brief. ScopeProp generates a polished, client-ready
          proposal — scope, timeline, and pricing — in under 2 minutes.
          No templates. No blank pages.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <Button size="lg" asChild className="shadow-lg shadow-violet-200/60">
            <Link href="/auth/signup">
              Generate your first proposal free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild className="text-gray-600">
            <Link href="#how-it-works">See how it works →</Link>
          </Button>
        </div>
        <div className="mt-5 flex items-center gap-5 text-sm text-gray-400">
          <span>No credit card required</span>
          <span className="w-px h-3 bg-gray-200" />
          <span>3 free proposals included</span>
          <span className="w-px h-3 bg-gray-200" />
          <span>Takes 2 minutes to set up</span>
        </div>

        {/* Upgraded proposal preview */}
        <div className="mt-16 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-violet-100/30 overflow-hidden ring-1 ring-black/[0.04]">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-3 flex-1 rounded-md bg-white border border-gray-200 px-3 py-1 text-xs text-gray-400 text-left font-mono">
              acme-corp.scopeprop.com
            </div>
          </div>
          {/* Proposal header band */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 text-white text-left">
            <div className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-1">
              Business Proposal
            </div>
            <h2 className="text-2xl font-black leading-snug">
              E-commerce Platform Redesign
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Prepared for Acme Corp · April 2025
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["E-commerce", "9 weeks", "$18,500"].map((tag, i) => (
                <span
                  key={tag}
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                    i === 2
                      ? "bg-violet-500 text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="p-6 space-y-4 text-left">
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/70 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-500">
                Executive Summary
              </div>
              <p className="px-4 py-3 text-sm text-gray-700 leading-relaxed">
                We propose a comprehensive redesign of your e-commerce platform to
                increase conversion rate, improve mobile UX, and reduce cart
                abandonment by an estimated{" "}
                <span className="font-semibold text-gray-900">18–25%</span>...
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { phase: "Discovery", weeks: "1 week", n: "01" },
                { phase: "Design", weeks: "2 weeks", n: "02" },
                { phase: "Development", weeks: "6 weeks", n: "03" },
              ].map(({ phase, weeks, n }) => (
                <div
                  key={phase}
                  className="rounded-xl border border-gray-100 bg-white p-3 text-center"
                >
                  <div className="text-xs font-black text-violet-200 mb-0.5">
                    {n}
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {phase}
                  </div>
                  <div className="text-xs text-violet-600 font-medium mt-0.5">
                    {weeks}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-900 px-5 py-4 text-white">
              <div>
                <div className="text-xs opacity-40 mb-0.5">Total Investment</div>
                <div className="text-2xl font-black">$18,500</div>
              </div>
              <button className="rounded-xl bg-violet-500 hover:bg-violet-400 transition-colors px-5 py-2.5 text-sm font-bold">
                Accept Proposal →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logo strip ───────────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 py-10 px-6 bg-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">
            Trusted by freelancers and agencies at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { name: "Pixel Studio", cls: "font-bold tracking-tight text-gray-700 text-lg" },
              { name: "Growthlab", cls: "font-black italic text-gray-600 text-lg" },
              { name: "NOVACRAFT", cls: "font-semibold tracking-widest text-xs text-gray-500 uppercase" },
              { name: "Studio 14", cls: "font-light text-xl text-gray-500 tracking-wide" },
              { name: "CodeForm", cls: "font-mono font-bold text-gray-700" },
              { name: "Verve Agency", cls: "font-bold italic text-gray-500" },
            ].map(({ name, cls }) => (
              <span
                key={name}
                className={`${cls} opacity-60 hover:opacity-100 transition-opacity cursor-default`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 py-14 px-6 bg-white">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "2 min", label: "Average time to generate", sub: "vs. 2+ hours manually" },
            { stat: "3×", label: "Faster than writing manually", sub: "Tested across 500+ proposals" },
            { stat: "87%", label: "Client open rate", sub: "Industry average is 52%" },
            { stat: "5,000+", label: "Proposals generated", sub: "And growing every day" },
          ].map(({ stat, label, sub }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="w-8 h-0.5 bg-violet-400 rounded-full mb-3" />
              <div className="text-4xl font-black text-gray-900 mb-1">{stat}</div>
              <div className="text-sm font-semibold text-gray-700">{label}</div>
              <div className="text-xs text-gray-400 mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900">
              Everything you need to close the deal
            </h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">
              From first brief to signed contract — ScopeProp handles the
              entire proposal lifecycle.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: Zap,
                title: "AI Proposal Generation",
                desc: "Paste your brief, pick a tone, and get a full scope of work, deliverables, timeline, and pricing in seconds.",
                comingSoon: false,
              },
              {
                icon: FileText,
                title: "Smart Scope Detection",
                desc: "AI flags missing scope items and suggests deliverables you may have forgotten — protecting you from scope creep.",
                comingSoon: false,
              },
              {
                icon: Eye,
                title: "Real-Time Client Tracking",
                desc: "Know the moment your client opens the proposal and how long they spent on each section.",
                comingSoon: false,
              },
              {
                icon: Package,
                title: "Beautiful Client Pages",
                desc: "Every proposal becomes a shareable, mobile-friendly page. Clients can review and accept — no account needed.",
                comingSoon: false,
              },
              {
                icon: PenLine,
                title: "E-Signature Built In",
                desc: "Clients sign directly on the proposal page. No DocuSign, no PDFs back and forth.",
                comingSoon: true,
              },
              {
                icon: Star,
                title: "AI Pricing Recommendations",
                desc: "AI suggests pricing based on project type, scope complexity, and your target market.",
                comingSoon: true,
              },
            ].map(({ icon: Icon, title, desc, comingSoon }) => (
              <div
                key={title}
                className={`relative rounded-2xl border bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group ${
                  comingSoon ? "border-gray-100 opacity-70" : "border-gray-100 hover:border-violet-100"
                }`}
              >
                {comingSoon && (
                  <span className="absolute top-5 right-5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                    Coming soon
                  </span>
                )}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl mb-5 ${
                    comingSoon ? "bg-gray-50" : "bg-violet-50 group-hover:bg-violet-100 transition-colors"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${comingSoon ? "text-gray-400" : "text-violet-600"}`}
                  />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{title}</h3>
                <p className={`text-sm leading-relaxed ${comingSoon ? "text-gray-400" : "text-gray-500"}`}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900">
              Freelancers love it
            </h2>
            <p className="mt-3 text-gray-500 text-lg">
              Real results from real users.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "I used to spend 3 hours writing proposals. Now it takes 10 minutes and my close rate is way up.",
                name: "Marcus T.",
                role: "Web developer, freelance",
              },
              {
                quote:
                  "The AI actually understands scope. It flagged deliverables I forgot every single time. Clients are impressed.",
                name: "Priya S.",
                role: "UX designer, agency owner",
              },
              {
                quote:
                  "Sent my first proposal the same day I signed up. Client accepted within 2 hours. That's never happened before.",
                name: "James K.",
                role: "Brand strategist",
              },
            ].map(({ quote, name, role }) => (
              <div
                key={name}
                className="rounded-2xl bg-white border border-gray-100 p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-amber-400"
                      fill="#fbbf24"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-sm leading-relaxed mb-6">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <div>
                  <div className="text-sm font-bold text-gray-900">{name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            From brief to signed in 4 steps
          </h2>
          <p className="text-gray-500 mb-16 text-lg">
            No templates. No blank pages. Just describe your project and let
            AI do the work.
          </p>
          <div className="space-y-4 text-left">
            {[
              {
                step: "01",
                title: "Describe your project",
                desc: "Fill in a guided form: client details, project goals, deliverables, and pricing model.",
              },
              {
                step: "02",
                title: "AI generates your proposal",
                desc: "ScopeProp writes the full proposal — executive summary, scope, timeline, pricing breakdown, and terms.",
              },
              {
                step: "03",
                title: "Review and customize",
                desc: "Edit any section inline. Accept AI suggestions or rewrite from scratch. Your proposal, your voice.",
              },
              {
                step: "04",
                title: "Send and track",
                desc: "Share a branded link. Get notified when it's opened. Collect the acceptance and close the deal.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="flex gap-6 rounded-2xl bg-white border border-gray-100 p-6 hover:border-violet-100 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex-shrink-0 text-4xl font-black text-violet-100">
                  {step}
                </div>
                <div className="pt-1">
                  <div className="font-bold text-gray-900 mb-1 text-base">{title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900">Simple pricing</h2>
            <p className="mt-4 text-gray-500 text-lg">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "3 proposals / month",
                  "AI generation",
                  "Shareable client link",
                  "Basic tracking",
                ],
                cta: "Start free",
                href: "/auth/signup",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$29",
                period: "/ month",
                features: [
                  "Unlimited proposals",
                  "E-signature",
                  "Full engagement tracking",
                  "Custom branding",
                  "PDF export",
                  "Priority AI",
                ],
                cta: "Start Pro — most popular",
                href: "/auth/signup?plan=pro",
                highlight: true,
              },
              {
                name: "Agency",
                price: "$79",
                period: "/ month",
                features: [
                  "Everything in Pro",
                  "5 team seats",
                  "Client workspaces",
                  "White-label",
                  "API access",
                  "Dedicated support",
                ],
                cta: "Start Agency",
                href: "/auth/signup?plan=agency",
                highlight: false,
              },
            ].map(({ name, price, period, features, cta, href, highlight }) => (
              <div
                key={name}
                className={`relative rounded-2xl border p-8 flex flex-col transition-all ${
                  highlight
                    ? "border-violet-500 bg-violet-600 text-white shadow-2xl shadow-violet-200 md:-mt-4 md:-mb-4"
                    : "border-gray-100 bg-white hover:shadow-md"
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-amber-400 px-4 py-1 text-xs font-black text-amber-900 shadow-sm whitespace-nowrap">
                      ★ Most Popular
                    </span>
                  </div>
                )}
                <div
                  className={`text-sm font-bold mb-2 mt-1 ${
                    highlight ? "text-violet-200" : "text-gray-500"
                  }`}
                >
                  {name}
                </div>
                <div className="flex items-end gap-1 mb-6">
                  <span
                    className={`text-5xl font-black ${
                      highlight ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {price}
                  </span>
                  <span
                    className={`text-sm mb-2 ${
                      highlight ? "text-violet-200" : "text-gray-400"
                    }`}
                  >
                    {period}
                  </span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 flex-shrink-0 ${
                          highlight ? "text-violet-300" : "text-violet-500"
                        }`}
                      />
                      <span
                        className={highlight ? "text-violet-100" : "text-gray-600"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={
                    highlight
                      ? "bg-white text-violet-700 hover:bg-violet-50 font-bold shadow-lg"
                      : ""
                  }
                  variant={highlight ? "ghost" : "default"}
                >
                  <Link href={href}>{cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />
        <div className="relative mx-auto max-w-2xl text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/80 mb-8">
            <Zap className="h-3.5 w-3.5" />
            Join 500+ freelancers already winning more clients
          </div>
          <h2 className="text-4xl font-black mb-5 leading-tight">
            Stop losing deals to slow proposals
          </h2>
          <p className="text-violet-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Freelancers and agencies that respond faster win more. Start
            generating proposals in under 2 minutes — completely free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-violet-700 hover:bg-violet-50 shadow-xl shadow-violet-900/30 font-bold"
              asChild
            >
              <Link href="/auth/signup">
                Create your free account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-violet-300 text-sm">
              No credit card · 3 proposals free
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            ScopeProp
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/#features" className="hover:text-gray-700 transition-colors">Features</Link>
            <Link href="/#pricing" className="hover:text-gray-700 transition-colors">Pricing</Link>
            <Link href="/#how-it-works" className="hover:text-gray-700 transition-colors">How it works</Link>
            <span>© {new Date().getFullYear()} ScopeProp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
