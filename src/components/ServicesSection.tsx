"use client";

import React, { useRef } from "react";
import {
  Brain,
  Code2,
  Workflow,
  BarChart3,
  FolderKanban,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "@/lib/gsap";

const ServicesSection = () => {
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
            scrollTrigger: { trigger: ".services-header", start: "top 78%" },
          })
          .from(".services-label", { y: 20, opacity: 0, duration: 0.6, ...ir })
          .from(
            ".services-line",
            { yPercent: 110, duration: 1, stagger: 0.12, ease: "power4.out", ...ir },
            "-=0.3"
          )
          .from(".services-desc", { y: 30, opacity: 0, duration: 0.8, ...ir }, "-=0.5");

        // Cards reveal (single stagger — batch proved fragile mid-tween)
        gsap.from(".service-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".services-grid", start: "top 85%" },
        });

        // Subtle alternating parallax by column for depth (desktop only).
        // yPercent, not y — the reveal above owns y and they must not fight.
        if (window.innerWidth >= 1024) {
          gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
            gsap.to(card, {
              yPercent: i % 3 === 1 ? -3 : 2,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
          });
        }

        // Bottom CTA reveal
        gsap.from(".services-cta", {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          ...ir,
          scrollTrigger: { trigger: ".services-cta", start: "top 85%" },
        });

        // Glow blobs parallax
        gsap.to(".services-blob-1", {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to(".services-blob-2", {
          yPercent: 15,
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

  const services = [
    {
      icon: Brain,
      title: t("services.service1Title"),
      description: t("services.service1Desc"),
      features: [
        t("services.service1Feature1"),
        t("services.service1Feature2"),
        t("services.service1Feature3"),
        t("services.service1Feature4"),
      ],
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI"],
      gradient: "from-onono-cyan-500 to-onono-electric-500",
      glowColor: "rgba(0, 212, 255, 0.3)",
    },
    {
      icon: Code2,
      title: t("services.service2Title"),
      description: t("services.service2Desc"),
      features: [
        t("services.service2Feature1"),
        t("services.service2Feature2"),
        t("services.service2Feature3"),
        t("services.service2Feature4"),
      ],
      technologies: ["React", "Node.js", "Flutter", ".NET"],
      gradient: "from-onono-electric-500 to-onono-green-500",
      glowColor: "rgba(59, 130, 246, 0.3)",
    },
    {
      icon: Workflow,
      title: t("services.service3Title"),
      description: t("services.service3Desc"),
      features: [
        t("services.service3Feature1"),
        t("services.service3Feature2"),
        t("services.service3Feature3"),
        t("services.service3Feature4"),
      ],
      technologies: ["BPMN", "RPA", "Cloud", "APIs"],
      gradient: "from-onono-green-500 to-onono-cyan-500",
      glowColor: "rgba(46, 204, 64, 0.3)",
    },
    {
      icon: BarChart3,
      title: t("services.service4Title"),
      description: t("services.service4Desc"),
      features: [
        t("services.service4Feature1"),
        t("services.service4Feature2"),
        t("services.service4Feature3"),
        t("services.service4Feature4"),
      ],
      technologies: ["Power BI", "Tableau", "SQL", "Python"],
      gradient: "from-onono-cyan-500 to-onono-green-500",
      glowColor: "rgba(0, 212, 255, 0.3)",
    },
    {
      icon: FolderKanban,
      title: t("services.service5Title"),
      description: t("services.service5Desc"),
      features: [
        t("services.service5Feature1"),
        t("services.service5Feature2"),
        t("services.service5Feature3"),
        t("services.service5Feature4"),
      ],
      technologies: ["Jira", "Scrum", "Kanban", "Agile"],
      gradient: "from-onono-electric-500 to-onono-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.3)",
    },
    {
      icon: GraduationCap,
      title: t("services.service6Title"),
      description: t("services.service6Desc"),
      features: [
        t("services.service6Feature1"),
        t("services.service6Feature2"),
        t("services.service6Feature3"),
        t("services.service6Feature4"),
      ],
      technologies: ["Workshops", "Certificações", "Mentoria", "E-Learning"],
      gradient: "from-onono-green-500 to-onono-electric-500",
      glowColor: "rgba(46, 204, 64, 0.3)",
    },
  ];

  return (
    <section
      id="services"
      className="py-32 lg:py-40 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-onono-midnight-950 via-onono-midnight-900 to-onono-midnight-950">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        {/* Glow effects */}
        <div className="services-blob-1 absolute top-1/4 right-0 w-[600px] h-[600px] bg-onono-cyan-500/5 rounded-full blur-[150px]" />
        <div className="services-blob-2 absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-onono-green-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="services-header text-center mb-20">
          <div className="services-label text-xs uppercase tracking-[0.35em] text-[#c9a876] mb-4">
            02 — {t("services.badge")}
          </div>

          <h2 className="font-serif text-[clamp(2.25rem,5vw,5rem)] mb-6 leading-[1.1]">
            <span className="block overflow-hidden pb-1">
              <span className="services-line block text-white font-medium">
                {t("services.title")}
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="services-line block italic text-[#d8b98a]">
                {t("services.titleHighlight")}
              </span>
            </span>
          </h2>

          <p className="services-desc text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t("services.description")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div key={index} className="service-card group">
                <div
                  className="glass-card-hover h-full p-8 relative"
                  style={
                    {
                      "--glow-color": service.glowColor,
                    } as React.CSSProperties
                  }
                >
                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${service.glowColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-onono-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {t("services.keyFeatures")}
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-onono-cyan-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {t("services.technologies")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-gray-300 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-onono-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] group/btn">
                    <span>{t("services.learnMore")}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="services-cta mt-24">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-onono-cyan-500/10 via-onono-electric-500/10 to-onono-green-500/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-onono-cyan-500/20 rounded-full blur-[100px]" />

            <div className="relative z-10">
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                {t("services.ctaTitle")}
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {t("services.ctaDescription")}
              </p>
              <button
                onClick={() => {
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-glow text-onono-midnight-900 font-bold inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
              >
                <span>{t("services.ctaButton")}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
