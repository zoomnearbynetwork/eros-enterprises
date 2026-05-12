"use client";

import Link from "next/link";
import { Menu, MessageCircle, PhoneCall } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#f6b11a]/20 bg-[#020617]/78 shadow-[0_1px_0_rgba(0,152,255,0.22),0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0098ff]/55 to-transparent" />
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-[#0098ff]/35 bg-[radial-gradient(circle_at_35%_20%,rgba(246,177,26,0.5),transparent_34%),#07111f] text-sm font-bold tracking-[0.18em] text-[#fff6d8] uppercase shadow-[0_0_30px_rgba(0,152,255,0.2)]">
            EE
          </div>
          <div>
            <div className="font-heading text-lg font-medium text-white">
              Eros Enterprises
            </div>
            <div className="text-[11px] tracking-[0.24em] text-[#fff6d8]/62 uppercase">
              Lighting + security automation
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
                    ? "bg-[#0098ff]/16 text-white shadow-[inset_0_0_0_1px_rgba(0,152,255,0.24)]"
                    : "text-[#fff6d8]/76 hover:bg-white/7 hover:text-white"
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
            className="rounded-full border-[#0098ff]/35 bg-[#0098ff]/10 text-white hover:bg-[#0098ff]/18"
          >
            <a href="https://wa.me/919920111774" className="inline-flex items-center gap-2">
              <MessageCircle className="size-4" />
              WhatsApp Now
            </a>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#f6b11a] px-5 font-semibold text-[#07111f] shadow-[0_0_28px_rgba(246,177,26,0.28)] hover:bg-[#ffcf5a]"
          >
            <Link href="/contact">Get Free Site Visit</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full border-white/10 bg-white/7 text-white hover:bg-white/12"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
            <SheetContent
            side="right"
            className="border-l border-[#f6b11a]/20 bg-[#020617] text-white"
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
                        ? "bg-[#0098ff]/16 text-white"
                        : "text-[#fff6d8]/76 hover:bg-white/7 hover:text-white"
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
                variant="outline"
                className="mb-3 h-12 w-full rounded-full border-[#0098ff]/35 bg-[#0098ff]/10 text-white hover:bg-[#0098ff]/18"
              >
                <a href="https://wa.me/919920111774" className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4" />
                  WhatsApp Now
                </a>
              </Button>
              <Button
                asChild
                className="h-12 w-full rounded-full bg-[#f6b11a] font-semibold text-[#07111f] hover:bg-[#ffcf5a]"
              >
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <PhoneCall className="size-4" />
                  Get Free Site Visit
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
