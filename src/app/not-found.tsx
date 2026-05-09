import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-start justify-center gap-6 px-5 py-16 sm:px-8 lg:px-10">
      <div className="text-sm font-semibold tracking-[0.28em] text-amber-200 uppercase">
        404
      </div>
      <h1 className="font-heading text-4xl text-white sm:text-5xl">
        The page you requested could not be found.
      </h1>
      <p className="max-w-2xl text-base leading-8 text-zinc-400">
        The link may be outdated, or the page may have moved. You can continue
        browsing the website or head straight to the contact page.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-full bg-amber-300 text-zinc-950 hover:bg-amber-200">
          <Link href="/">Back to home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-white/10 bg-white/6 text-white hover:bg-white/10"
        >
          <Link href="/contact">Contact Eros</Link>
        </Button>
      </div>
    </div>
  );
}
