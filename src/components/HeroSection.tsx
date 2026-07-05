"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Brain, Cpu, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "@/lib/gsap";

const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), {
  ssr: false,
});

const HeroSection = () => {
  const { t } = useTranslation();
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop, motion allowed: pinned cinematic scrub + intro choreography
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Intro (plays once on mount)
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-label-line", {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.8,
              delay: 0.3,
            })
            .from(".hero-label-text", { opacity: 0, x: -12, duration: 0.7 }, "-=0.5")
            .from(
              ".hero-line",
              { yPercent: 110, duration: 1.2, stagger: 0.14, ease: "power4.out" },
              "-=0.4"
            )
            .from(".hero-desc", { y: 24, opacity: 0, duration: 0.8 }, "-=0.6")
            .from(
              ".hero-cta",
              { y: 16, opacity: 0, duration: 0.6, stagger: 0.1 },
              "-=0.5"
            )
            .from(".hero-meta", { opacity: 0, y: 12, duration: 0.8 }, "-=0.3");

          // Scroll scrub: subtle camera drift on the baobab image — forward on
          // scroll down, backward on scroll up (scrub is bidirectional).
          // ponytail: image drift stands in for a real video; swap the <img>
          // for a scrubbed <video> when Higgsfield credits allow.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stageRef.current,
              start: "top top",
              end: "+=180%",
              pin: true,
              scrub: 1,
            },
            defaults: { ease: "none" },
          });
          tl.to(imgRef.current, { scale: 1.18, yPercent: -4, duration: 10 }, 0)
            .to(".hero-glow", { opacity: 0.45, duration: 10 }, 0)
            .to(headRef.current, { yPercent: -18, opacity: 0, duration: 3.5 }, 2.5)
            .to(".hero-meta", { opacity: 0, duration: 2 }, 2.5)
            // autoAlpha (not opacity): visibility:hidden while invisible, so
            // the absolutely-positioned strip can't swallow clicks meant for
            // the CTA buttons underneath it.
            .fromTo(
              ".hero-stat",
              { y: 40, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 2, stagger: 0.3 },
              5
            )
            .fromTo(
              ".hero-cards-wrap",
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 1.5 },
              5.8
            )
            .fromTo(
              ".hero-card",
              { y: 60, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 2.5, stagger: 0.4 },
              6
            );
        }
      );

      // Mobile, motion allowed: no pin, simple reveals, gentle drift on image
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-label-text", { opacity: 0, x: -12, duration: 0.6, delay: 0.2 })
            .from(".hero-line", { yPercent: 110, duration: 0.9, stagger: 0.12 }, "-=0.3")
            .from(".hero-desc", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
            .from(".hero-cta", { y: 15, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3");

          gsap.to(imgRef.current, {
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: stageRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      );
      // prefers-reduced-motion: no context added — everything stays static.
    },
    { scope: stageRef }
  );

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  const cards = [
    { icon: Brain, title: t("hero.card1Title"), desc: t("hero.card1Desc") },
    { icon: Cpu, title: t("hero.card2Title"), desc: t("hero.card2Desc") },
    { icon: BarChart3, title: t("hero.card3Title"), desc: t("hero.card3Desc") },
  ];

  const stats = [
    { value: t("hero.stat1Value"), label: t("hero.stat1Label") },
    { value: t("hero.stat2Value"), label: t("hero.stat2Label") },
    { value: t("hero.stat3Value"), label: t("hero.stat3Label") },
  ];

  return (
    <section id="home" className="relative">
      <div
        ref={stageRef}
        className="relative min-h-screen md:h-screen overflow-hidden flex flex-col bg-[#050607]"
      >
        {/* Cinematic layer: baobab + Africa circuit map, heavily subdued */}
        <div className="absolute inset-0">
          <img
            ref={imgRef}
            src="/hero-poster.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-70 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050607]/70 via-[#050607]/25 to-[#050607]" />
          <div className="hero-glow absolute inset-0 opacity-0 bg-onono-cyan-500/10 mix-blend-screen pointer-events-none" />
        </div>

        <ParticleCanvas />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pb-0 w-full">
          <div ref={headRef} className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="hero-label-line block w-12 h-px bg-[#c9a876]" />
              <span className="hero-label-text text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#c9a876]">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="font-serif text-[clamp(2.75rem,7vw,7.5rem)] text-white leading-[1.05] mb-6">
              <span className="block overflow-hidden pb-2">
                <span className="hero-line block font-medium">
                  {t("hero.title")}
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="hero-line block italic text-[#d8b98a]">
                  {t("hero.titleLine2")}
                </span>
              </span>
            </h1>

            <p className="hero-desc text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mb-8">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToContact}
                className="hero-cta btn-glow group text-onono-midnight-900 font-bold hover:scale-105 active:scale-95 transition-transform"
              >
                <span className="flex items-center justify-center gap-2">
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={scrollToServices}
                className="hero-cta btn-outline-glow hover:scale-105 active:scale-95 transition-transform"
              >
                {t("hero.ctaSecondary")}
              </button>
            </div>
          </div>

          {/* Editorial strip: stats + capability cards (revealed by scroll on desktop) */}
          <div
            ref={stripRef}
            className="pointer-events-none mt-16 md:mt-0 md:absolute md:bottom-24 md:left-4 md:right-4 lg:left-8 lg:right-8"
          >
            <div className="grid grid-cols-3 gap-6 max-w-lg mb-10">
              {stats.map((stat, i) => (
                <div key={i} className="hero-stat">
                  <div className="font-serif text-3xl md:text-4xl text-[#d8b98a]">
                    {stat.value}
                  </div>
                  <div className="text-[11px] md:text-xs text-gray-500 uppercase tracking-[0.2em] mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-cards-wrap grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
              {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className="hero-card pointer-events-auto flex items-start gap-4 p-6 bg-[#0a0c0e] hover:bg-[#101316] transition-colors"
                  >
                    <Icon className="w-5 h-5 shrink-0 mt-1 text-[#c9a876]" />
                    <div>
                      <h3 className="text-white text-sm font-semibold tracking-wide mb-1">
                        {card.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom metadata row (reference-style editorial footer of the hero) */}
        <div className="hero-meta relative z-10 hidden md:block absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="border-t border-white/10 pt-4 flex items-end justify-between text-xs text-gray-500">
              <div>
                <div className="text-gray-300">Luanda, Angola</div>
                <div>8.84° S, 13.23° E</div>
              </div>
              <div className="text-center">
                <div className="text-gray-300">Onono</div>
                <div>{t("footer.tagline")}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-300">Scroll</div>
                <div className="animate-bounce">↓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
