"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { gsap, useGSAP } from "@/lib/gsap";

const Navigation = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      // Animate the inner container, not <nav> itself — the nav carries
      // transition-all for the scrolled-background swap and CSS transitions
      // fight GSAP's per-frame updates.
      gsap.from(".nav-inner", {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: navRef }
  );

  const navItems = useMemo(
    () => [
      { name: t("nav.home"), href: "#home" },
      { name: t("nav.about"), href: "#about" },
      { name: t("nav.services"), href: "#services" },
      { name: t("nav.contact"), href: "#contact" },
    ],
    [t]
  );

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-onono-midnight-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="nav-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-onono-cyan-500/20 blur-xl rounded-full" />
                <img
                  src="/logo.png"
                  alt="Onono Engenharia e Tecnologias"
                  className="relative h-10 w-auto"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="relative text-gray-300 hover:text-white transition-all font-medium group hover:scale-105 active:scale-95"
                suppressHydrationWarning={true}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-onono-cyan-500 to-onono-electric-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-all font-medium hover:scale-105 active:scale-95"
            >
              {t("auth.signIn")}
            </Link>
            <button
              onClick={() => scrollToSection("#contact")}
              className="btn-glow text-onono-midnight-900 font-bold text-sm px-6 py-2.5 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
              suppressHydrationWarning={true}
            >
              <Sparkles className="w-4 h-4" />
              {t("nav.getStarted")}
            </button>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-onono-cyan-400 transition-colors p-2 active:scale-95"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-onono-midnight-900/95 backdrop-blur-xl border-t border-white/10 overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="block w-full text-left text-gray-300 hover:text-onono-cyan-400 transition-colors font-medium py-3 border-b border-white/5 active:scale-95"
              suppressHydrationWarning={true}
            >
              {item.name}
            </button>
          ))}
          <Link
            href="/login"
            className="block w-full text-left text-gray-300 hover:text-onono-cyan-400 transition-colors font-medium py-3 border-b border-white/5 active:scale-95"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("auth.signIn")}
          </Link>
          <button
            onClick={() => scrollToSection("#contact")}
            className="w-full btn-glow text-onono-midnight-900 font-bold py-3 mt-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            suppressHydrationWarning={true}
          >
            <Sparkles className="w-4 h-4" />
            {t("nav.getStarted")}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
