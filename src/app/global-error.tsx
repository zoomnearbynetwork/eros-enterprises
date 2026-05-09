"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#09090b] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-start justify-center gap-6 px-5 py-16 sm:px-8 lg:px-10">
          <div className="text-sm font-semibold tracking-[0.28em] text-amber-200 uppercase">
            Application error
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl">
            Something went wrong while loading the page.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-zinc-400">
            Please try the request again. If the problem continues, you can go
            back to the homepage or contact the team directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => unstable_retry()}
              className="rounded-full bg-amber-300 text-zinc-950 hover:bg-amber-200"
            >
              Try again
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/10 bg-white/6 text-white hover:bg-white/10"
            >
              <Link href="/">Go home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
