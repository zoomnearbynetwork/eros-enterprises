"use client";

import Link from "next/link";
import { ArrowRight, Menu, MessageCircle, PhoneCall } from "lucide-react";
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

const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[1.7rem] border border-[#f6b11a]/16 bg-[#020617]/76 shadow-[0_18px_60px_rgba(0,0,0,0.34),0_0_0_1px_rgba(0,152,255,0.08)] backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,177,26,0.06),transparent_28%,transparent_72%,rgba(0,152,255,0.08))]" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#f6b11a]/80 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-[radial-gradient(circle_at_center,rgba(0,152,255,0.12),transparent_65%)]" />

          <div className="relative flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-7">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-[1.15rem] border border-[#0098ff]/32 bg-[radial-gradient(circle_at_30%_20%,rgba(246,177,26,0.55),transparent_34%),linear-gradient(160deg,#0a1630,#020617)] shadow-[0_0_26px_rgba(0,152,255,0.2)]">
                <span className="text-sm font-bold tracking-[0.22em] text-[#fff6d8] uppercase">
                  EE
                </span>
              </div>
              <div className="min-w-0">
                <div className="truncate font-heading text-xl font-medium text-white sm:text-2xl">
                  Eros Enterprises
                </div>
                <div className="truncate text-[11px] font-semibold tracking-[0.28em] text-[#fff6d8]/70 uppercase">
                  Premium lighting and automation
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1.5 xl:flex">
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
                      "rounded-full px-4 py-2.5 text-sm font-medium transition duration-200",
                      active
                        ? "border border-[#f6b11a]/26 bg-[linear-gradient(135deg,rgba(246,177,26,0.18),rgba(0,152,255,0.16))] text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
                        : "text-[#fff6d8]/82 hover:bg-white/8 hover:text-white"
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
                className="h-11 rounded-full border-[#0098ff]/30 bg-[#0098ff]/10 px-5 text-white hover:border-[#0098ff]/55 hover:bg-[#0098ff]/18"
              >
                <a href={whatsappHref} className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4 text-[#f6b11a]" />
                  WhatsApp Now
                </a>
              </Button>
              <Button
                asChild
                className="h-11 rounded-full bg-[linear-gradient(135deg,#ffcf5a,#f6b11a_45%,#ff8a00)] px-5 font-semibold text-[#07111f] shadow-[0_12px_30px_rgba(246,177,26,0.32)] hover:brightness-105"
              >
                <Link href="/contact" className="inline-flex items-center gap-2">
                  Get Free Site Visit
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  size="icon"
                  variant="outline"
                  className="size-11 rounded-full border-white/12 bg-white/7 text-white hover:bg-white/12"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-l border-[#f6b11a]/18 bg-[linear-gradient(180deg,#020617,#07111f)] p-0 text-white"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(246,177,26,0.2),transparent_24%),radial-gradient(circle_at_20%_24%,rgba(0,152,255,0.18),transparent_22%)]" />
                <SheetHeader className="relative border-b border-white/10 px-6 py-6 text-left">
                  <SheetTitle className="font-heading text-3xl text-white">
                    Eros Enterprises
                  </SheetTitle>
                  <p className="text-sm leading-7 text-[#fff6d8]/70">
                    Decorative lighting, security systems, and smart automation for premium spaces.
                  </p>
                </SheetHeader>
                <div className="relative flex flex-1 flex-col gap-2 px-5 py-6">
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
                          "rounded-[1.25rem] px-4 py-3.5 text-base font-medium transition",
                          active
                            ? "border border-[#f6b11a]/20 bg-[linear-gradient(135deg,rgba(246,177,26,0.16),rgba(0,152,255,0.16))] text-white"
                            : "text-[#fff6d8]/82 hover:bg-white/8 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
                <div className="relative border-t border-white/10 px-5 py-5">
                  <div className="grid gap-3">
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 w-full rounded-full border-[#0098ff]/32 bg-[#0098ff]/10 text-white hover:bg-[#0098ff]/18"
                    >
                      <a href={whatsappHref} className="inline-flex items-center gap-2">
                        <MessageCircle className="size-4 text-[#f6b11a]" />
                        WhatsApp Now
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="h-12 w-full rounded-full bg-[linear-gradient(135deg,#ffcf5a,#f6b11a_45%,#ff8a00)] font-semibold text-[#07111f]"
                    >
                      <Link href="/contact" className="inline-flex items-center gap-2">
                        <PhoneCall className="size-4" />
                        Get Free Site Visit
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
