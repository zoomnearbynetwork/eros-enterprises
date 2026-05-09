"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-8 text-white">
      <div className="text-sm font-semibold tracking-[0.22em] text-rose-200 uppercase">
        Dashboard error
      </div>
      <h2 className="mt-3 font-heading text-3xl">This dashboard section failed to load.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-rose-100/85">
        The request can usually be recovered by retrying the segment. If this
        continues, check the database connection and server logs before deploy.
      </p>
      <Button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-6 rounded-full bg-white text-rose-700 hover:bg-white/90"
      >
        Retry segment
      </Button>
    </div>
  );
}
