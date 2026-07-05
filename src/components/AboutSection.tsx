"use client";

import React, { useRef } from "react";
import {
  Target,
  Users,
  Award,
  Globe,
  GraduationCap,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "@/lib/gsap";

const AboutSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // immediateRender: false on every triggered from() — otherwise a late
        // ScrollTrigger.refresh (font/image load) reverts elements to the
        // cached hidden from-state and they stay invisible.
        const ir = { immediateRender: false };

        // Header: masked line reveal
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".about-header", start: "top 78%" },
          })
          .from(".about-label", { y: 20, opacity: 0, duration: 0.6, ...ir })
          .from(
            ".about-line",
            { yPercent: 110, duration: 1, stagger: 0.12, ease: "power4.out", ...ir },
            "-=0.3"
          )
          .from(".about-desc", { y: 30, opacity: 0, duration: 0.8, ...ir }, "-=0.5");

        // Stats stagger
        gsap.from(".stat-card", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".about-stats", start: "top 82%" },
        });

        // Mission / vision opposing drifts
        gsap.from(".about-left", {
          x: -40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".about-columns", start: "top 78%" },
        });
        gsap.from(".about-right", {
          x: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".about-columns", start: "top 78%" },
        });

        // Values reveal (single stagger — batch proved fragile mid-tween)
        gsap.from(".value-card", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".about-values", start: "top 85%" },
        });

        // Background glow blobs: scrubbed parallax
        gsap.to(".about-blob-1", {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to(".about-blob-2", {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  const stats = [
    {
      icon: GraduationCap,
      number: "PhD",
      label: t("about.stat1Label"),
      description: t("about.stat1Desc"),
    },
    {
      icon: Clock,
      number: "24/7",
      label: t("about.stat2Label"),
      description: t("about.stat2Desc"),
    },
    {
      icon: Shield,
      number: "100%",
      label: t("about.stat3Label"),
      description: t("about.stat3Desc"),
    },
    {
      icon: Zap,
      number: "3x",
      label: t("about.stat4Label"),
      description: t("about.stat4Desc"),
    },
  ];

  const values = [
    {
      icon: Target,
      title: t("about.value1Title"),
      description: t("about.value1Desc"),
      gradient: "from-onono-cyan-500 to-onono-electric-500",
    },
    {
      icon: Users,
      title: t("about.value2Title"),
      description: t("about.value2Desc"),
      gradient: "from-onono-electric-500 to-onono-green-500",
    },
    {
      icon: Award,
      title: t("about.value3Title"),
      description: t("about.value3Desc"),
      gradient: "from-onono-green-500 to-onono-cyan-500",
    },
    {
      icon: Globe,
      title: t("about.value4Title"),
      description: t("about.value4Desc"),
      gradient: "from-onono-cyan-500 to-onono-green-500",
    },
  ];

  return (
    <section
      id="about"
      className="py-32 lg:py-40 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-onono-midnight-950 via-onono-midnight-900 to-onono-midnight-950">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        {/* Glow effects */}
        <div className="about-blob-1 absolute top-0 left-1/4 w-[500px] h-[500px] bg-onono-cyan-500/5 rounded-full blur-[120px]" />
        <div className="about-blob-2 absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-onono-green-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="about-header text-center mb-20">
          <div className="about-label text-xs uppercase tracking-[0.35em] text-[#c9a876] mb-4">
            01 — {t("about.badge")}
          </div>

          <h2 className="font-serif text-[clamp(2.25rem,5vw,5rem)] mb-6 leading-[1.1]">
            <span className="block overflow-hidden pb-1">
              <span className="about-line block text-white font-medium">
                {t("about.title")}
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="about-line block italic text-[#d8b98a]">
                {t("about.titleHighlight")}
              </span>
            </span>
          </h2>

          <p className="about-desc text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t("about.description")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="about-stats grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card glass-card-hover p-6 text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-onono-cyan-500/20 to-onono-electric-500/20 flex items-center justify-center group-hover:from-onono-cyan-500/30 group-hover:to-onono-electric-500/30 transition-all">
                  <Icon className="w-7 h-7 text-onono-cyan-400" />
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-white font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="about-columns grid lg:grid-cols-2 gap-16 items-center mb-24 border-t border-white/10 pt-16">
          {/* Left Content */}
          <div className="about-left">
            <h3 className="font-serif text-3xl text-white mb-6">
              {t("about.presenceTitle")}
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed text-lg">
              {t("about.presenceDescription1")}
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed text-lg">
              {t("about.presenceDescription2")}
            </p>

            {/* Mission Statement */}
            <div className="glass-card p-6 border-l-4 border-onono-cyan-500">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-onono-cyan-400" />
                {t("about.missionTitle")}
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {t("about.missionDescription")}
              </p>
            </div>
          </div>

          {/* Right Content - Vision */}
          <div className="about-right space-y-8">
            {/* Vision Statement */}
            <div className="glass-card p-6 border-l-4 border-onono-green-500">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-onono-green-400" />
                {t("about.visionTitle")}
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {t("about.visionDescription")}
              </p>
            </div>

            {/* Differentiator Box */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-onono-cyan-500/10 rounded-full blur-[50px]" />
              <h4 className="text-xl font-semibold text-white mb-4">
                {t("about.differentiatorTitle")}
              </h4>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-onono-cyan-500 to-onono-electric-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">{i}</span>
                    </div>
                    <span className="text-gray-300">
                      {t(`about.differentiator${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="border-t border-white/10 pt-16">
          <h3 className="font-serif text-3xl md:text-4xl text-center text-white mb-12">
            {t("about.valuesTitle")}
          </h3>
          <div className="about-values grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="value-card glass-card-hover p-6 text-center group">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
