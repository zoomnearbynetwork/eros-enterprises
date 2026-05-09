"use client";

import Link from "next/link";
import { Menu, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { primaryNav } from "@/content/website";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-sm font-semibold tracking-[0.18em] text-amber-100 uppercase">
            EE
          </div>
          <div>
            <div className="font-heading text-lg font-medium text-white">
              Eros Enterprises
            </div>
            <div className="text-[11px] tracking-[0.24em] text-zinc-400 uppercase">
              Electrical + decorative lighting
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {primaryNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-300 hover:bg-white/6 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/10 bg-white/6 text-white hover:bg-white/10"
          >
            <a href={`tel:${siteConfig.phone}`}>Call us</a>
          </Button>
          <Button
            asChild
            className="rounded-full bg-amber-300 px-5 font-semibold text-zinc-950 hover:bg-amber-200"
          >
            <Link href="/contact">Request a quote</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-white/10 bg-white/6 text-white hover:bg-white/10"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-l border-white/10 bg-[#09090b] text-white"
          >
            <SheetHeader className="border-b border-white/10">
              <SheetTitle className="font-heading text-2xl text-white">
                Eros Enterprises
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-2 p-6">
              {primaryNav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-base transition",
                      active
                        ? "bg-white/10 text-white"
                        : "text-zinc-300 hover:bg-white/6 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-white/10 p-6">
              <Button
                asChild
                className="h-12 w-full rounded-full bg-amber-300 font-semibold text-zinc-950 hover:bg-amber-200"
              >
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <PhoneCall className="size-4" />
                  Request a quote
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
