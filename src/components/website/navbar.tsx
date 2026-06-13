"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, MessageCircle, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/website/brand-mark";
import { ThemeToggle } from "@/components/website/theme-toggle";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-4 sm:px-5">
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "theme-transition relative overflow-hidden rounded-[1.8rem] border backdrop-blur-2xl",
            scrolled
              ? "border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] shadow-[var(--shadow-strong)]"
              : "border-transparent bg-[color:color-mix(in_srgb,var(--surface-elevated)_86%,transparent)] shadow-[0_12px_40px_rgba(6,17,31,0.08)]",
          )}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,163,0,0.05),transparent_25%,transparent_75%,rgba(0,166,255,0.06))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFCC33]/65 to-transparent" />
          <div className="absolute -right-8 top-0 h-full w-44 bg-[radial-gradient(circle_at_center,rgba(244,163,0,0.12),transparent_68%)]" />

          <div className="relative flex min-h-[5.25rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-7">
            <BrandMark />

            <nav className="hidden items-center gap-2 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2">
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
                      "theme-transition rounded-full px-4 py-3 text-[0.98rem] font-medium duration-200",
                      active
                        ? "border border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)] shadow-[var(--shadow-soft)]"
                        : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-accent)] hover:text-[color:var(--foreground)]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <ThemeToggle />
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] px-5 text-base text-[color:var(--foreground)] hover:bg-[color:var(--surface-accent)]"
              >
                <a href={whatsappHref} className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4 text-[#F4A300]" />
                  WhatsApp Now
                </a>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full bg-[linear-gradient(135deg,#F4A300,#FFCC33)] px-6 text-base font-semibold text-[#06111f] shadow-[0_16px_36px_rgba(244,163,0,0.26)] hover:brightness-105"
              >
                <Link href="/contact" className="inline-flex items-center gap-2">
                  Get Free Quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  size="icon"
                  variant="outline"
                  className="size-11 rounded-full border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-accent)]"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-l border-[color:var(--border-strong)] bg-[color:var(--popover)] p-0 text-[color:var(--foreground)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,163,0,0.2),transparent_24%),radial-gradient(circle_at_20%_24%,rgba(0,166,255,0.16),transparent_22%)]" />
                <SheetHeader className="relative border-b border-[color:var(--border)] px-6 py-6 text-left">
                  <BrandMark />
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <p className="text-sm leading-7 text-[color:var(--muted-foreground)]">
                    Decorative lighting, automation, and electrical execution for luxury residential and commercial spaces.
                  </p>
                  <div className="pt-2">
                    <ThemeToggle className="size-10" />
                  </div>
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
                          "theme-transition rounded-[1.25rem] px-4 py-3.5 text-base font-medium",
                          active
                            ? "border border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)]"
                            : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-accent)] hover:text-[color:var(--foreground)]"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
                <div className="relative border-t border-[color:var(--border)] px-5 py-5">
                  <div className="grid gap-3">
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 w-full rounded-full border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-accent)]"
                    >
                      <a href={whatsappHref} className="inline-flex items-center gap-2">
                        <MessageCircle className="size-4 text-[#F4A300]" />
                        WhatsApp Now
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="h-12 w-full rounded-full bg-[linear-gradient(135deg,#F4A300,#FFCC33)] font-semibold text-[#06111f]"
                    >
                      <Link href="/contact" className="inline-flex items-center gap-2">
                        <PhoneCall className="size-4" />
                        Get Free Quote
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
