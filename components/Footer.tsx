"use client";

import React from "react";
import Link from "next/link";
import { Shield, Zap, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/data/toolsRegistry";
import { BrandLogo } from "@/components/BrandLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm transition-colors mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-6 space-y-4 max-w-md">
            <Link href="/" className="inline-flex items-center group" aria-label="AI Text Utility Home">
              <BrandLogo size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              A high-performance suite of 43+ browser-based tools for formatting, converting, analyzing, and cleaning text. Built for developers, writers, students, and professionals who demand speed, privacy, and precision.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-500" />
                100% Private Client-Side
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                Zero Latency
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-500" />
                AI Enhanced
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-normal">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/#category-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {cat.name} Tools
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources & Trust */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-normal">
              Legal & Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Robots Directive
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Privacy Badge */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} AI Text Utility. All rights reserved.
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            Client-side transformations execute locally in your browser memory.
          </div>
        </div>
      </div>
    </footer>
  );
};
