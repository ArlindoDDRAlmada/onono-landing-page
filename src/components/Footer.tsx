"use client";

import React, { useState, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Facebook,
  Twitter,
  Instagram,
  ArrowUp,
  ArrowRight,
  Clock,
  Send,
  Heart,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "@/lib/gsap";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(footerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
      });
    },
    { scope: footerRef }
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerLinks = {
    services: [
      { name: t("footer.aiIntegration"), href: "#services" },
      { name: t("footer.softwareDev"), href: "#services" },
      { name: t("footer.digitalTransformation"), href: "#services" },
      { name: t("footer.dataAnalysis"), href: "#services" },
    ],
    company: [
      { name: t("footer.aboutUs"), href: "#about" },
      { name: t("footer.ourTeam"), href: "#team" },
      { name: t("footer.careers"), href: "#" },
      { name: t("footer.contact"), href: "#contact" },
    ],
    legal: [
      { name: t("footer.privacyPolicy"), href: "#" },
      { name: t("footer.termsOfService"), href: "#" },
      { name: t("footer.cookiePolicy"), href: "#" },
    ],
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "#",
      hoverColor: "hover:bg-blue-600",
    },
    {
      name: "Github",
      icon: Github,
      href: "#",
      hoverColor: "hover:bg-gray-700",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      hoverColor: "hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      hoverColor: "hover:bg-sky-500",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      hoverColor: "hover:bg-pink-600",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      content: "administrative@onono-technologies.com",
      href: "mailto:administrative@onono-technologies.com",
    },
    { icon: Phone, content: "+244 929 976 519", href: "tel:+244929976519" },
    {
      icon: MapPin,
      content: "Rua Eduardo Mondlane, Ingombotas, Luanda, Angola",
      href: "https://maps.google.com",
    },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const subject = encodeURIComponent("Nova Subscrição Newsletter - Onono");
      const body = encodeURIComponent(
        `Nova subscrição para a newsletter:\n\nEmail: ${email}\nData: ${new Date().toLocaleString(
          "pt-PT"
        )}\n\nPor favor, adicione este email à lista de newsletter.`
      );

      const mailtoLink = `mailto:administrative@onono-technologies.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;

      setSubmitStatus("success");
      setEmail("");

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Error sending newsletter subscription:", error);
      setSubmitStatus("error");

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer ref={footerRef} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-onono-midnight-950 to-onono-midnight-900">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-onono-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-onono-green-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-white/10">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-onono-cyan-500/10 via-transparent to-onono-green-500/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-onono-cyan-500/20 rounded-full blur-[80px]" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-onono-cyan-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                {t("footer.newsletterBadge")}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
                {t("footer.newsletterTitle")}
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                {t("footer.newsletterDescription")}
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.newsletterPlaceholder")}
                  className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-onono-cyan-500/50 focus:ring-1 focus:ring-onono-cyan-500/50 transition-all"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 ${
                    submitStatus === "success"
                      ? "bg-green-500 text-white"
                      : submitStatus === "error"
                      ? "bg-red-500 text-white"
                      : "btn-glow text-onono-midnight-900"
                  } ${isSubmitting ? "opacity-70 cursor-not-allowed hover:scale-100" : ""}`}
                >
                  {isSubmitting ? (
                    "..."
                  ) : submitStatus === "success" ? (
                    "✓"
                  ) : submitStatus === "error" ? (
                    "!"
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("footer.subscribe")}
                    </>
                  )}
                </button>
              </form>
              {submitStatus === "success" && (
                <p className="text-green-400 text-sm mt-3">
                  {t("footer.subscribeSuccess")}
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-400 text-sm mt-3">
                  {t("footer.subscribeError")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div>
                <div className="mb-6">
                  <img
                    src="/logo.png"
                    alt="Onono Engenharia e Tecnologias"
                    className="h-12 w-auto mb-2"
                  />
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    {t("footer.tagline")}
                  </p>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {t("footer.description")}
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <a
                        key={index}
                        href={info.href}
                        className="flex items-center gap-3 text-gray-400 hover:text-onono-cyan-400 hover:translate-x-1 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-onono-cyan-500/20 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{info.content}</span>
                      </a>
                    );
                  })}
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:scale-110 hover:-translate-y-0.5 active:scale-95 ${social.hoverColor} transition-all border border-white/5`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Services Links */}
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    {t("footer.servicesTitle")}
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.services.map((link, index) => (
                      <li key={index}>
                        <button
                          onClick={() => scrollToSection(link.href)}
                          className="text-gray-400 hover:text-onono-cyan-400 hover:translate-x-1 transition-all text-sm"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Links */}
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    {t("footer.companyTitle")}
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <button
                          onClick={() => scrollToSection(link.href)}
                          className="text-gray-400 hover:text-onono-cyan-400 hover:translate-x-1 transition-all text-sm"
                        >
                          {link.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Links */}
                <div>
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    {t("footer.legalTitle")}
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-onono-cyan-400 hover:translate-x-1 transition-all text-sm inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hours + CTA — fills the space under the link columns */}
              <div className="glass-card mt-10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-onono-cyan-500/20 to-onono-electric-500/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-onono-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">
                      {t("contact.infoHoursTitle")}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {t("contact.infoHoursContent")}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {t("contact.infoHoursSubtitle")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => scrollToSection("#contact")}
                  className="btn-glow text-onono-midnight-900 font-bold text-sm px-6 py-3 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform shrink-0"
                >
                  {t("nav.getStarted")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>{t("footer.copyright")}</span>
              <span className="flex items-center gap-1">
                {t("footer.madeWith")}
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                {t("footer.inAngola")}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-gray-500 text-sm">
                {t("footer.builtWith")}
              </div>

              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-onono-cyan-500 to-onono-electric-500 flex items-center justify-center hover:shadow-glow-cyan hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all text-white"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
